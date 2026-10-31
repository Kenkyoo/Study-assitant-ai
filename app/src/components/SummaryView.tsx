import { BookOpen, CheckCircle2, Compass } from "lucide-react";
import type { StudySummary } from "@/types";

interface StudySessionProps {
  session: {
    title: string;
    sourceType: string;
    summary: unknown;
    studyRoute: unknown;
    createdAt: string | Date;
  };
}

export default function SummaryView({ session }: StudySessionProps) {
  // Hacemos un casting seguro por si Prisma lo devuelve como JsonValue
  const summary = session.summary as StudySummary | null;
  const studyRoute = session.studyRoute as string[] | null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Cabecera de la Sesión */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded-full">
            {session.sourceType}
          </span>
          <span className="text-sm text-gray-400">
            {new Date(session.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {session.title}
        </h1>
      </div>

      {/* Resumen General */}
      {summary && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl">Resumen General</h2>
          </div>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100 text-base">
            {summary.overview}
          </p>

          {/* Puntos Clave */}
          {summary.keyPoints && summary.keyPoints.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-xl">Puntos Clave</h2>
              </div>
              <ul className="grid gap-3">
                {summary.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs hover:border-indigo-100 transition-colors"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Ruta de Estudio Sugerida */}
      {studyRoute && Array.isArray(studyRoute) && studyRoute.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <Compass className="w-5 h-5" />
            <h2 className="text-xl">Ruta de Estudio Sugerida</h2>
          </div>
          <div className="relative border-l-2 border-indigo-100 ml-4 pl-6 space-y-6 py-2">
            {studyRoute.map((step, index) => (
              <div key={index} className="relative group">
                <span className="absolute -left-[31px] top-0 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white" />
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide block mb-1">
                    Paso {index + 1}
                  </span>
                  <p className="text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
