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
      <p className="text-sm text-muted-foreground">
        Todavía no has creado ninguna sesión. Pega un texto en el panel para
        empezar.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {sessions.map((s) => (
        <li key={s.id}>
          <Link
            href={`/dashboard/session/${s.id}`}
            className="-mx-2 flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted"
          >
            <span className="truncate font-medium">{s.title}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {s.createdAt.toLocaleDateString("es-AR")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
