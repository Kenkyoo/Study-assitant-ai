"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FileUploader() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sourceType: "text" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar el contenido con IA");
      }

      router.push(`/dashboard/session/${data.data.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al generar el contenido con IA",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generar asistente de estudio</CardTitle>
        <CardDescription>
          Pega tus apuntes o el tema a estudiar y la IA creará un resumen, una
          ruta de estudio y un cuestionario.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Texto a estudiar</Label>
            <Textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ej: Biología celular, historia de la Revolución Francesa, conceptos de Next.js..."
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading
              ? "Generando resumen y cuestionario..."
              : "Crear sesión de estudio"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
