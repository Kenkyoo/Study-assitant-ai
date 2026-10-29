// Source - https://stackoverflow.com/a/63884537
// Posted by Chamika Sandamal, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-29, License - CC BY-SA 4.0

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { db } from '@/lib/prisma'; // O tu cliente de base de datos actual

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
      required: ['overview', 'keyPoints'],
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
        required: ['question', 'options', 'correctAnswer'],
      },
    },
  },
  required: ['title', 'summary', 'studyRoute', 'quizQuestions'],
};

export async function POST(req: Request) {
  try {
    const { content, sourceType, userId } = await req.json();

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (content o userId)' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no está configurada en el servidor' },
        { status: 500 }
      );
    }

    // Llamada a la API de Gemini con el modelo flash y esquema forzado
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analiza el siguiente contenido educativo. Genera un título descriptivo, un resumen (overview y keyPoints), una ruta de estudio sugerida en pasos, y un cuestionario interactivo de 3 a 5 preguntas con sus opciones y la respuesta correcta.\n\nContenido:\n${content}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
    } catch (apiError: any) {
      if (apiError.status === 503 || apiError.code === 503) {
        return NextResponse.json(
          { error: 'El servicio de IA está experimentando mucha demanda en este momento. Por favor, intenta de nuevo en unos segundos.' },
          { status: 503 }
        );
      }
      throw apiError;
    }

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Gemini no devolvió ninguna respuesta.');
    }

    const generatedData = JSON.parse(rawText);

    // Guardar en la base de datos (asegúrate de adaptar esto si usas Prisma estándar o tu cliente personalizado)
    const session = await prisma.studySession.create({
      data: {
        userId,
        title: generatedData.title,
        sourceType: sourceType || 'text',
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
    console.error('Error en /api/generate:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
