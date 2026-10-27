import { Link } from "@tanstack/react-router";
import { CalendarDays, LayoutDashboard, LogOut, ScanFace, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/api/client";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/analise", label: "Nova Análise", icon: ScanFace },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/clientes", label: "Clientes", icon: Users },
] as const;

function SignOut() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return (
    <button
      onClick={async () => {
        await qc.cancelQueries();
        qc.clear();
        await supabase.auth.signOut();
        navigate({ to: "/auth", replace: true });
      }}
      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sair
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar px-6 py-8 md:flex">
        <Brand />
        <nav className="mt-12 flex-1 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/dashboard" }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              activeProps={{ className: "bg-sidebar-accent !text-gold font-medium" }}
            >
              <n.icon className="h-4 w-4" strokeWidth={1.5} />
              {n.label}
            </Link>
          ))}
        </nav>
        <SignOut />
      </aside>
      <header className="flex items-center justify-between border-b border-border px-5 py-3 md:hidden">
        <Brand />
        <SignOut />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-28 pt-6 md:px-10 md:py-10">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/dashboard" }}
            className="flex flex-col items-center gap-1 py-3 text-[11px] text-muted-foreground"
            activeProps={{ className: "!text-gold font-medium" }}
          >
            <n.icon className="h-5 w-5" strokeWidth={1.5} />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 font-display text-lg text-gold">
        V
      </div>
      <div>
        <div className="font-display text-xl leading-none tracking-wide">Visage</div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Estética & IA</div>
      </div>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        status === "Confirmado"
          ? "rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium text-success"
          : "rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-medium text-gold"
      }
    >
      {status}
    </span>
  );
}

