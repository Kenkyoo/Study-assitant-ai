"use client";

import { useState } from "react";
import { HelpCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizRunnerProps {
  quizId: string;
  questions: Question[];
  lastScore: number | null;
}

export default function QuizRunner({
  quizId,
  questions,
  lastScore,
}: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-muted-foreground">
          No hay preguntas de cuestionario disponibles para esta sesión.
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const answers = questions.map((_, idx) => selectedAnswers[idx] ?? null);
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el resultado");
      }

      setResult({ score: data.score, total: data.total });
      setShowResults(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "No se pudo guardar el resultado",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setResult(null);
    setSubmitError(null);
  };

  if (showResults && result) {
    const { score, total } = result;
    const percentage = Math.round((score / total) * 100);

    return (
      <Card className="mx-auto w-full max-w-4xl text-center">
        <CardContent className="space-y-6 py-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {percentage}%
          </div>
          <h2 className="text-2xl font-extrabold">¡Cuestionario completado!</h2>
          <p className="text-muted-foreground">
            Has acertado{" "}
            <span className="font-semibold text-primary">{score}</span> de{" "}
            <span className="font-semibold">{total}</span> preguntas.
          </p>
          <Button size="lg" onClick={restartQuiz}>
            <RotateCcw />
            Volver a intentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <HelpCircle className="size-5" />
          Cuestionario de autoevaluación
        </CardTitle>
        {lastScore !== null && (
          <CardDescription>
            Último resultado: {lastScore} de {questions.length}
          </CardDescription>
        )}
        <CardAction>
          <Badge variant="secondary">
            Pregunta {currentIndex + 1} de {questions.length}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <h3 className="text-lg font-bold leading-snug">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3" role="radiogroup">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIndex] === option;
            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectOption(option)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  isSelected
                    ? "border-primary bg-primary/5 font-medium"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <span>{option}</span>
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? "border-primary bg-primary" : ""
                  }`}
                >
                  {isSelected && (
                    <span className="size-2 rounded-full bg-primary-foreground" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="justify-between border-t">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[currentIndex] || submitting}
        >
          {submitting
            ? "Guardando..."
            : currentIndex === questions.length - 1
              ? "Finalizar quiz"
              : "Siguiente"}
        </Button>
      </CardFooter>
    </Card>
  );
}
