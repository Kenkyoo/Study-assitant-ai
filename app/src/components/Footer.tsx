export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>Recall · Asistente de estudio con IA</p>
        <a
          href="https://github.com/Kenkyoo/Study-assitant-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Código en GitHub
        </a>
      </div>
    </footer>
  );
}
