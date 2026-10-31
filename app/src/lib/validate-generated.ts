import type { QuizQuestion, StudySummary } from "@/types";

export interface GeneratedContent {
  title: string;
  summary: StudySummary;
  studyRoute: string[];
  quizQuestions: QuizQuestion[];
}

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const cleanStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter(isNonEmptyString).map((s) => s.trim()) : [];

const normalize = (s: string) => s.trim().toLowerCase();

function cleanQuestion(raw: unknown): QuizQuestion | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const question = r.question;
  const correctAnswer = r.correctAnswer;
  if (!isNonEmptyString(question) || !isNonEmptyString(correctAnswer))
    return null;

  const options = [...new Set(cleanStrings(r.options))];
  if (options.length < 2) return null;

  // La respuesta correcta debe ser una de las opciones (se tolera diferencia de mayúsculas/espacios)
  const correct =
    options.find((o) => o === correctAnswer.trim()) ??
    options.find((o) => normalize(o) === normalize(correctAnswer));
  if (!correct) return null;

  return { question: question.trim(), options, correctAnswer: correct };
}

export function validateGenerated(raw: unknown): GeneratedContent | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const title = r.title;
  const summary = r.summary as Record<string, unknown> | null | undefined;
  if (
    !isNonEmptyString(title) ||
    !summary ||
    !isNonEmptyString(summary.overview)
  ) {
    return null;
  }

  const quizQuestions = Array.isArray(r.quizQuestions)
    ? r.quizQuestions
        .map(cleanQuestion)
        .filter((q): q is QuizQuestion => q !== null)
    : [];
  if (quizQuestions.length === 0) return null;

  return {
    title: title.trim(),
    summary: {
      overview: summary.overview.trim(),
      keyPoints: cleanStrings(summary.keyPoints),
    },
    studyRoute: cleanStrings(r.studyRoute),
    quizQuestions,
  };
}
