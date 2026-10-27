import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { PageTitle, StatusBadge } from "@/components/AppShell";
import { actions, SERVICES, useStore, type AppointmentStatus } from "@/lib/store";
import { fmt } from "@/lib/dates";

export const Route = createFileRoute("/_authenticated/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — Visage" },
      { name: "description", content: "Calendário de consultas e agendamentos da clínica." },
      { property: "og:title", content: "Agenda — Visage" },
      { property: "og:description", content: "Calendário interativo de consultas." },
    ],
  }),
  component: Agenda,
});

const key = (d: Date) => format(d, "yyyy-MM-dd");

function Agenda() {
  const { appointments, clients } = useStore();
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(key(new Date()));
  const [open, setOpen] = useState(false);

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) }),
    [month],
  );
  const byDay = (k: string) => appointments.filter((a) => a.date === k).sort((a, b) => a.time.localeCompare(b.time));
  const name = (id: string) => clients.find((c) => c.id === id)?.nome ?? "—";
  const today = key(new Date());

  return (
    <div className="animate-rise">
      <PageTitle eyebrow="Consultas" title="Agenda">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> Novo agendamento
        </button>
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card-lux p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl capitalize">{format(month, "MMMM yyyy", { locale: ptBR })}</h2>
            <div className="flex gap-1">
              <button onClick={() => setMonth(addMonths(month, -1))} className="rounded-lg p-2 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setMonth(addMonths(month, 1))} className="rounded-lg p-2 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <div key={i} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const k = key(d);
              const list = byDay(k);
              return (
                <button
                  key={k}
                  onClick={() => setSelected(k)}
                  className={`flex aspect-square flex-col items-center justify-start rounded-xl p-1 text-sm transition-colors md:aspect-auto md:h-20 ${
                    selected === k ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  } ${isSameMonth(d, month) ? "" : "opacity-30"}`}
                >
                  <span className={k === today && selected !== k ? "font-semibold text-gold" : ""}>{format(d, "d")}</span>
                  <div className="mt-1 flex gap-0.5">
                    {list.slice(0, 3).map((a) => (
                      <span key={a.id} className={`h-1.5 w-1.5 rounded-full ${a.status === "Confirmado" ? "bg-success" : "bg-gold"}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-lux p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Dia selecionado</p>
          <h3 className="mt-1 font-display text-2xl capitalize">{fmt(selected, "EEEE, d MMM")}</h3>
          <ul className="mt-4 space-y-3">
            {byDay(selected).length === 0 && <li className="text-sm text-muted-foreground">Nenhuma consulta.</li>}
            {byDay(selected).map((a) => (
              <li key={a.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl">{a.time}</span>
                  <button onClick={() => actions.toggleStatus(a.id)} title="Alternar status">
                    <StatusBadge status={a.status} />
                  </button>
                </div>
                <div className="mt-1 text-sm font-medium">{name(a.client_id)}</div>
                <div className="text-xs text-muted-foreground">{a.service}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open && <NewAppointment date={selected} onClose={() => setOpen(false)} />}
    </div>
  );
}

function NewAppointment({ date, onClose }: { date: string; onClose: () => void }) {
  const { clients } = useStore();
  const [nome, setNome] = useState("");
  const [d, setD] = useState(date);
  const [time, setTime] = useState("10:00");
  const [service, setService] = useState<string>(SERVICES[0]!);
  const [status, setStatus] = useState<AppointmentStatus>("Pendente");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    const existing = clients.find((c) => c.nome.toLowerCase() === nome.trim().toLowerCase());
    const client = existing ?? actions.addClient(nome.trim());
    actions.addAppointment({ client_id: client.id, date: d, time, service, status });
    onClose();
  };

  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 backdrop-blur-sm md:items-center" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card-lux w-full max-w-md animate-rise space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl">Novo agendamento</h3>
          <button type="button" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <label className="block space-y-1 text-xs text-muted-foreground">Nome do cliente
          <input list="clientes" value={nome} onChange={(e) => setNome(e.target.value)} className={field} required />
          <datalist id="clientes">{clients.map((c) => <option key={c.id} value={c.nome} />)}</datalist>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1 text-xs text-muted-foreground">Data
            <input type="date" value={d} onChange={(e) => setD(e.target.value)} className={field} required />
          </label>
          <label className="block space-y-1 text-xs text-muted-foreground">Horário
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={field} required />
          </label>
        </div>
        <label className="block space-y-1 text-xs text-muted-foreground">Tipo de serviço
          <select value={service} onChange={(e) => setService(e.target.value)} className={field}>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["Pendente", "Confirmado"] as const).map((s) => (
            <button type="button" key={s} onClick={() => setStatus(s)}
              className={`rounded-xl border py-2.5 text-sm ${status === s ? "border-gold bg-accent" : "border-border"}`}>{s}</button>
          ))}
        </div>
        <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground">Agendar</button>
      </form>
    </div>
  );
}

