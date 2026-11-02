import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/prisma";
import SummaryView from "@/components/SummaryView";
import QuizRunner from "@/components/QuizRunner";
import { buttonVariants } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import type { QuizQuestion } from "@/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const session = await db.studySession.findUnique({
    where: { id },
    include: { quizzes: true },
  });

  if (!session) {
    notFound();
  }

  if (session.userId !== user.id) {
    redirect("/dashboard");
  }

  const quiz = session.quizzes?.[0];

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/dashboard/history"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Volver al historial
        </Link>

        <SummaryView session={session} />

        {quiz && (
          <QuizRunner
            quizId={quiz.id}
            questions={quiz.questions as unknown as QuizQuestion[]}
            lastScore={quiz.score}
          />
        )}
      </div>
    </main>
  );
}
