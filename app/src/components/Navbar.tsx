import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Sparkles className="size-5 text-primary" />
            Recall
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Panel
            </Link>
            <Link
              href="/dashboard/history"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Historial
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {email && (
            <span className="hidden text-sm text-muted-foreground md:inline">
              {email}
            </span>
          )}
          <ThemeToggle />
          <form action="/signout" method="post">
            <Button type="submit" variant="outline" size="sm">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
