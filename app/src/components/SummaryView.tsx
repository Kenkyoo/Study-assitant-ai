import { BookOpen, CheckCircle2, Compass } from "lucide-react";
import type { StudySummary } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const summary = session.summary as StudySummary | null;
  const studyRoute = session.studyRoute as string[] | null;

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl tracking-tight">
          {session.title}
        </CardTitle>
        <CardDescription>
          {new Date(session.createdAt).toLocaleDateString("es-AR")}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="uppercase">
            {session.sourceType}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-8">
        {summary && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <BookOpen className="size-5" />
              <h2 className="text-xl">Resumen general</h2>
            </div>
            <p className="rounded-xl border bg-muted/50 p-5 leading-relaxed">
              {summary.overview}
            </p>

            {summary.keyPoints && summary.keyPoints.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <CheckCircle2 className="size-5" />
                  <h2 className="text-xl">Puntos clave</h2>
                </div>
                <ul className="grid gap-3">
                  {summary.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-xl border bg-card p-4"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {studyRoute && Array.isArray(studyRoute) && studyRoute.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Compass className="size-5" />
              <h2 className="text-xl">Ruta de estudio sugerida</h2>
            </div>
            <div className="relative ml-4 space-y-6 border-l-2 py-2 pl-6">
              {studyRoute.map((step, index) => (
                <div key={index} className="relative">
                  <span className="absolute -left-[31px] top-0 size-4 rounded-full bg-primary ring-4 ring-card" />
                  <div className="rounded-xl border bg-muted/50 p-4">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">
                      Paso {index + 1}
                    </span>
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
