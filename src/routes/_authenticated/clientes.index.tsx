import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { PageTitle } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { elapsed, fmt } from "@/lib/dates";

export const Route = createFileRoute("/_authenticated/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Visage" },
      { name: "description", content: "Lista de clientes e histórico de atendimentos." },
      { property: "og:title", content: "Clientes — Visage" },
      { property: "og:description", content: "Gestão de clientes e histórico." },
    ],
  }),
  component: Clientes,
});

function Clientes() {
  const { clients } = useStore();
  const [q, setQ] = useState("");
  const list = clients.filter((c) => c.nome.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="animate-rise">
      <PageTitle eyebrow="CRM" title="Clientes" />
      <div className="card-lux overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente…" className="w-full bg-transparent text-sm outline-none" />
        </div>
        <ul className="divide-y divide-border">
          {list.map((c) => (
            <li key={c.id}>
              <Link to="/clientes/$id" params={{ id: c.id }} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-display text-lg text-gold">
                  {c.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{c.nome}</div>
                  <div className="text-xs text-muted-foreground">{c.telefone || "Sem telefone"}</div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-xs">{fmt(c.last_visit_date)}</div>
                  <div className="text-[11px] text-muted-foreground">{elapsed(c.last_visit_date)}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

