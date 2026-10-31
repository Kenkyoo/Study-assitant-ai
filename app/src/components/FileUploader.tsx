'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FileUploader() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sourceType: 'text',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al generar el contenido con IA');
      }

      // Redirigir a la vista detallada de la sesión creada
      router.push(`/dashboard/session/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el contenido con IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Generar Asistente de Estudio</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pega tu texto, apuntes o tema a estudiar:
          </label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ej: Biología celular, historia de la Revolución Francesa, conceptos de Next.js..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Generando resumen y quiz con Gemini...' : 'Crear Sesión de Estudio 🚀'}
        </button>
      </form>
    </div>
  );
}
