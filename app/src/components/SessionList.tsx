import Link from "next/link";

interface SessionListItem {
  id: string;
  title: string;
  createdAt: Date;
}

export default function SessionList({
  sessions,
}: {
  sessions: SessionListItem[];
}) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Todavía no has creado ninguna sesión. Pega un texto en el panel para
        empezar.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {sessions.map((s) => (
        <li key={s.id}>
          <Link
            href={`/dashboard/session/${s.id}`}
            className="flex items-center justify-between gap-4 py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <span className="font-medium text-gray-800 truncate">
              {s.title}
            </span>
            <span className="text-xs text-gray-400 shrink-0">
              {s.createdAt.toLocaleDateString("es-AR")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
