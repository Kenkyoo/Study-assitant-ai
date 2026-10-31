import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/prisma";
import SessionList from "@/components/SessionList";

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
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            Historial de sesiones
          </h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
          >
            Volver al panel
          </Link>
        </div>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <SessionList sessions={sessions} />
        </section>
      </div>
    </main>
  );
}
