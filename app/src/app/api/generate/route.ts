// Source - https://stackoverflow.com/a/63884537
// Posted by Chamika Sandamal, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-29, License - CC BY-SA 4.0

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { db } from "@/lib/prisma"; // O tu cliente de base de datos actual
import { createClient } from "@/lib/supabase/server";

// Inicializar el cliente de Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Esquema estructurado para que Gemini devuelva exactamente lo que necesitamos
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING },
        keyPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["overview", "keyPoints"],
    },
    studyRoute: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    quizQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: { type: Type.STRING },
        },
        required: ["question", "options", "correctAnswer"],
      },
    },
  },
  required: ["title", "summary", "studyRoute", "quizQuestions"],
};

const MAX_CONTENT_LENGTH = 20000;
const ALLOWED_SOURCE_TYPES = ["text", "pdf", "youtube_url"];

const MAX_ATTEMPTS = 3;

function isOverloaded(err: any) {
  const msg = String(err?.message ?? "");
  return (
    err?.status === 503 ||
    err?.code === 503 ||
    msg.includes("503") ||
    msg.includes("UNAVAILABLE")
  );
}

async function generateWithRetry(
  params: Parameters<typeof ai.models.generateContent>[0],
) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      if (!isOverloaded(err) || attempt === MAX_ATTEMPTS) throw err;
      // Espera 1 s, luego 2 s antes de volver a intentar
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * 2 ** (attempt - 1)),
      );
    }
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    const content = typeof body.content === "string" ? body.content.trim() : "";
    const sourceType = ALLOWED_SOURCE_TYPES.includes(body.sourceType)
      ? body.sourceType
      : "text";

    if (!content) {
      return NextResponse.json(
        { error: "El contenido no puede estar vacío" },
        { status: 400 },
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        {
          error: `El contenido supera el máximo de ${MAX_CONTENT_LENGTH} caracteres`,
        },
        { status: 413 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no está configurada en el servidor" },
        { status: 500 },
      );
    }

    // Llamada a la API de Gemini con el modelo flash y esquema forzado
    let response;
    try {
      response = await generateWithRetry({
        model: "gemini-3.8-flash",
        contents: `Analiza el siguiente contenido educativo. Genera un título descriptivo, un resumen (overview y keyPoints), una ruta de estudio sugerida en pasos, y un cuestionario interactivo de 3 a 5 preguntas con sus opciones y la respuesta correcta.\n\nContenido:\n${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
    } catch (apiError: any) {
      if (isOverloaded(apiError)) {
        return NextResponse.json(
          {
            error:
              "El servicio de IA está experimentando mucha demanda en este momento. Por favor, intenta de nuevo en unos segundos.",
          },
          { status: 503 },
        );
      }
      throw apiError;
    }
    const rawText = response.text;
    if (!rawText) {
      throw new Error("Gemini no devolvió ninguna respuesta.");
    }

    const generatedData = JSON.parse(rawText);

    await db.user.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, email: user.email! },
    });
    // Guardar en la base de datos (asegúrate de adaptar esto si usas Prisma estándar o tu cliente personalizado)
    const session = await db.studySession.create({
      data: {
        userId: user.id,
        title: generatedData.title,
        sourceType,
        summary: generatedData.summary,
        studyRoute: generatedData.studyRoute,
        quizzes: {
          create: {
            questions: generatedData.quizQuestions,
          },
        },
      },
      include: {
        quizzes: true,
      },
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("Error en /api/generate:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
