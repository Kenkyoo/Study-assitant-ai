import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/prisma";
import FileUploader from "@/components/FileUploader";
import SessionList from "@/components/SessionList";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
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
    take: 5,
    select: { id: true, title: true, createdAt: true },
  });

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Panel de control</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <CardAction>
              <form action="/signout" method="post">
                <Button type="submit" variant="destructive">
                  Cerrar sesión
                </Button>
              </form>
            </CardAction>
          </CardHeader>
        </Card>

        <FileUploader />

        <Card>
          <CardHeader>
            <CardTitle>Sesiones recientes</CardTitle>
            <CardAction>
              <Link
                href="/dashboard/history"
                className={buttonVariants({ variant: "link", size: "sm" })}
              >
                Ver todo
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <SessionList sessions={sessions} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
