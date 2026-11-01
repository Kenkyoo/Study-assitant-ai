import { db } from '@/lib/prisma';

const LIMITS = [
  { windowMs: 10 * 60 * 1000, max: 3, label: '10 minutos' },
  { windowMs: 24 * 60 * 60 * 1000, max: 20, label: '24 horas' },
];

type LimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; message: string };

export async function checkGenerationLimit(userId: string): Promise<LimitResult> {
  const now = Date.now();

  for (const { windowMs, max, label } of LIMITS) {
    const recent = await db.studySession.findMany({
      where: { userId, createdAt: { gte: new Date(now - windowMs) } },
      orderBy: { createdAt: 'desc' },
      take: max,
      select: { createdAt: true },
    });

    if (recent.length >= max) {
      // La más antigua de las últimas `max` es la que libera un cupo al salir de la ventana
      const oldest = recent[recent.length - 1].createdAt.getTime();
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      const minutes = Math.ceil(retryAfterSeconds / 60);

      return {
        allowed: false,
        retryAfterSeconds,
        message: `Has alcanzado el límite de ${max} sesiones cada ${label}. Inténtalo de nuevo en ${minutes} minuto${minutes === 1 ? '' : 's'}.`,
      };
    }
  }

  return { allowed: true };
}