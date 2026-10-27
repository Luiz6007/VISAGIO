import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, Phone, ScanFace } from "lucide-react";
import { StatusBadge } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { elapsed, fmt } from "@/lib/dates";

export const Route = createFileRoute("/_authenticated/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Perfil do cliente — Visage" },
      { name: "description", content: "Perfil, última consulta e histórico de análises de visagismo." },
      { property: "og:title", content: "Perfil do cliente — Visage" },
      { property: "og:description", content: "Histórico de visagismo do cliente." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { id } = Route.useParams();
  const { clients, analyses, appointments } = useStore();
  const c = clients.find((x) => x.id === id);
  if (!c) return <p className="text-muted-foreground">Cliente não encontrado.</p>;
  const hist = analyses.filter((a) => a.client_id === id);
  const appts = appointments.filter((a) => a.client_id === id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="animate-rise space-y-6">
      <Link to="/clientes" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Clientes</Link>
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-accent font-display text-3xl text-gold">
          {c.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <h1 className="font-display text-4xl">{c.nome}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {c.telefone || "—"}</p>
        </div>
      </div>

      <div className="card-lux flex items-center gap-5 border-gold/40 bg-secondary p-6">
        <CalendarClock className="h-10 w-10 shrink-0 text-gold" strokeWidth={1.2} />
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Última consulta</p>
          <p className="mt-1 font-display text-3xl">{fmt(c.last_visit_date)} <span className="opacity-60">—</span> {elapsed(c.last_visit_date)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-display text-2xl">Histórico de análises</h2>
          {hist.length === 0 ? (
            <div className="card-lux p-6 text-sm text-muted-foreground">Nenhuma análise ainda.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {hist.map((a) => (
                <div key={a.id} className="card-lux overflow-hidden">
                  <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                    {a.image_url ? <img src={a.image_url} alt="Análise" className="h-full w-full object-cover" /> : <ScanFace className="h-10 w-10 text-gold/50" strokeWidth={1} />}
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{fmt(a.date)}</span><span>Simetria {a.symmetry}%</span></div>
                    <p className="font-display text-2xl">{a.face_shape}</p>
                    <p className="text-xs text-muted-foreground"><b className="text-foreground">Cabelo:</b> {a.recommendations.cabelo}</p>
                    <p className="text-xs text-muted-foreground"><b className="text-foreground">Sobrancelha:</b> {a.recommendations.sobrancelha}</p>
                    <p className="text-xs text-muted-foreground"><b className="text-foreground">Maquiagem:</b> {a.recommendations.maquiagem}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-3 font-display text-2xl">Agendamentos</h2>
          <div className="card-lux divide-y divide-border">
            {appts.length === 0 && <p className="p-5 text-sm text-muted-foreground">Nenhum agendamento.</p>}
            {appts.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm">{fmt(a.date)} · {a.time}</div>
                  <div className="text-xs text-muted-foreground">{a.service}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

