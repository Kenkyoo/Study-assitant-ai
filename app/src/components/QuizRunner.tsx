"use client";

import { useState } from "react";
import { HelpCircle, RotateCcw } from "lucide-react";

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
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
        No hay preguntas de cuestionario disponibles para esta sesión.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: option,
    });
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
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          {percentage}%
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          ¡Cuestionario Completado!
        </h2>
        <p className="text-gray-600">
          Has acertado{" "}
          <span className="font-semibold text-indigo-600">{score}</span> de{" "}
          <span className="font-semibold">{total}</span> preguntas.
        </p>

        <div className="pt-4">
          <button
            onClick={restartQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Cabecera del Quiz */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-xl">Cuestionario de Autoevaluación</h2>
          </div>
          {lastScore !== null && (
            <p className="text-xs text-gray-400 mt-1">
              Último resultado: {lastScore} de {questions.length}
            </p>
          )}
        </div>
        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          Pregunta {currentIndex + 1} de {questions.length}
        </span>
      </div>

      {/* Pregunta */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Opciones */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIndex] === option;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium"
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                }`}
              >
                <span>{option}</span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error al guardar */}
      {submitError && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {submitError}
        </p>
      )}

      {/* Botones de Navegación */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentIndex] || submitting}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting
            ? "Guardando..."
            : currentIndex === questions.length - 1
              ? "Finalizar Quiz"
              : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
