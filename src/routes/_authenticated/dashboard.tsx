import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Clock, ScanFace, Users } from "lucide-react";
import { PageTitle, StatusBadge } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { fmt } from "@/lib/dates";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Início — Visage" },
      { name: "description", content: "Resumo do dia, próximos agendamentos e métricas da clínica." },
      { property: "og:title", content: "Início — Visage" },
      { property: "og:description", content: "Resumo do dia e métricas da clínica de estética." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { clients, appointments, analyses } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const todays = appointments.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);
  const name = (id: string) => clients.find((c) => c.id === id)?.nome ?? "—";

  const stats = [
    { label: "Consultas hoje", value: todays.length, icon: CalendarCheck },
    { label: "Pendentes", value: appointments.filter((a) => a.status === "Pendente").length, icon: Clock },
    { label: "Clientes", value: clients.length, icon: Users },
    { label: "Análises IA", value: analyses.length, icon: ScanFace },
  ];

  return (
    <div className="animate-rise">
      <PageTitle eyebrow={fmt(today, "EEEE, d 'de' MMMM")} title="Bom dia" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-lux p-5">
            <s.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <div className="mt-4 font-display text-4xl">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card-lux p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Próximos agendamentos</h2>
            <Link to="/agenda" className="text-xs text-gold">Ver agenda</Link>
          </div>
          <ul className="divide-y divide-border">
            {upcoming.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 text-center">
                    <div className="font-display text-xl">{a.time}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">{fmt(a.date, "dd MMM")}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{name(a.client_id)}</div>
                    <div className="text-xs text-muted-foreground">{a.service}</div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </div>
        <Link to="/analise" className="card-lux group flex flex-col justify-between bg-secondary p-6">
          <ScanFace className="h-8 w-8 text-gold" strokeWidth={1.2} />
          <div className="mt-10">
            <h3 className="font-display text-3xl">Nova análise de visagismo</h3>
            <p className="mt-2 text-sm opacity-70">Envie uma foto e receba recomendações personalizadas em segundos.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
              Começar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

