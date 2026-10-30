/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';
import SummaryView from '@/components/SummaryView';
import QuizRunner from '@/components/QuizRunner';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  // 1. Validar autenticación con Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  // 2. Consultar la sesión en la base de datos con tu cliente personalizado
  const session = await db.studySession.findUnique({
    where: { id },
    include: { quizzes: true },
  });

  if (!session) {
    notFound();
  }

  // Opcional de seguridad: verificar que la sesión pertenezca al usuario logueado
  if (session.userId !== user.id) {
    redirect('/dashboard');
  }

  // 3. Extraer el primer quiz asociado a esta sesión
  const quiz = session.quizzes?.[0];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Vista del Resumen y Ruta de Estudio */}
        <SummaryView session={session} />

        {/* Cuestionario Interactivo */}
        {quiz && <QuizRunner questions={quiz.questions as any} />}
      </div>
    </main>
  );
}
