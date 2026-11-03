import type { QuizQuestion } from "@/types";

/**
 * Valida el formato de las respuestas recibidas del cliente.
 * Devuelve null si no es un array de strings/null con la longitud esperada.
 */
export function parseAnswers(
  raw: unknown,
  expectedLength: number,
): (string | null)[] | null {
  if (!Array.isArray(raw) || raw.length !== expectedLength) return null;
  if (!raw.every((a) => a === null || typeof a === "string")) return null;
  return raw;
}

/** Cuenta los aciertos. Una respuesta null (sin contestar) cuenta como fallo. */
export function scoreQuiz(
  questions: QuizQuestion[],
  answers: (string | null)[],
): number {
  return questions.reduce(
    (total, q, i) => total + (answers[i] === q.correctAnswer ? 1 : 0),
    0,
  );
}
