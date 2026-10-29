import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FileUploader from '@/components/FileUploader';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Componente para subir contenido conectado al ID real del usuario */}
        <FileUploader userId={user.id} />
      </div>
    </main>
  );
}
