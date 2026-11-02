import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/prisma";
import SessionList from "@/components/SessionList";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const sessions = await db.studySession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, title: true, createdAt: true },
  });

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Historial de sesiones</CardTitle>
            <CardAction>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "outline" })}
              >
                Volver al panel
              </Link>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardContent>
            <SessionList sessions={sessions} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
