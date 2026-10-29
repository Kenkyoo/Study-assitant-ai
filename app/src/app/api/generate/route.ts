// Source - https://stackoverflow.com/a/63884537
// Posted by Chamika Sandamal, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-29, License - CC BY-SA 4.0

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { Type, Schema } from "@google/genai";

// Definimos el esquema de la respuesta esperada de Gemini
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

export async function POST(req: Request) {
  try {
    const { content, sourceType, userId } = await req.json();

    if (!content || !userId) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 },
      );
    }

    // 1. Petición a la API de Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza el siguiente contenido y genera un resumen detallado, una ruta de aprendizaje sugerida y un cuestionario interactivo de 3 a 5 preguntas.\n\nContenido:\n${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const generatedData = JSON.parse(response.text || "{}");

    // 2. Guardar en la base de datos mediante Prisma
    const session = await prisma.studySession.create({
      data: {
        userId,
        title: generatedData.title,
        sourceType: sourceType || "text",
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
  } catch (error: any) {
    console.error("Error procesando solicitud:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 },
    );
  }
}
