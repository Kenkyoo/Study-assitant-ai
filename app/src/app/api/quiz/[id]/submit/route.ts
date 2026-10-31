import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/prisma";
import type { QuizQuestion } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const answers: unknown = body?.answers;

  if (
    !Array.isArray(answers) ||
    !answers.every((a) => a === null || typeof a === "string")
  ) {
    return NextResponse.json(
      { error: "Respuestas inválidas" },
      { status: 400 },
    );
  }

  // Solo encuentra el quiz si la sesión de estudio pertenece al usuario autenticado
  const quiz = await db.quiz.findFirst({
    where: { id, studySession: { userId: user.id } },
  });

  if (!quiz) {
    return NextResponse.json(
      { error: "Cuestionario no encontrado" },
      { status: 404 },
    );
  }

  const questions = quiz.questions as unknown as QuizQuestion[];

  if (answers.length !== questions.length) {
    return NextResponse.json(
      { error: "Respuestas inválidas" },
      { status: 400 },
    );
  }

  const score = questions.reduce(
    (total, q, i) => total + (answers[i] === q.correctAnswer ? 1 : 0),
    0,
  );

  await db.quiz.update({ where: { id: quiz.id }, data: { score } });

  return NextResponse.json({ score, total: questions.length });
}
