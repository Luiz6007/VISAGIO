import { useSyncExternalStore } from "react";

export type Client = { id: string; nome: string; telefone: string; last_visit_date: string };
export type AppointmentStatus = "Confirmado" | "Pendente";
export type Appointment = {
  id: string;
  client_id: string;
  date: string; // yyyy-MM-dd
  time: string;
  service: string;
  status: AppointmentStatus;
};
export type Recommendations = { cabelo: string; sobrancelha: string; maquiagem: string };
export type Analysis = {
  id: string;
  client_id: string;
  image_url: string;
  face_shape: string;
  symmetry: number;
  recommendations: Recommendations;
  date: string;
};

export const SERVICES = ["Primeira Consulta", "Retorno", "Análise Completa"];

const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

type State = { clients: Client[]; appointments: Appointment[]; analyses: Analysis[] };

let state: State = {
  clients: [
    { id: "c1", nome: "Helena Duarte", telefone: "(11) 98765-4321", last_visit_date: iso(-64) },
    { id: "c2", nome: "Marina Albuquerque", telefone: "(11) 99123-8877", last_visit_date: iso(-12) },
    { id: "c3", nome: "Beatriz Monteiro", telefone: "(21) 98444-1020", last_visit_date: iso(-130) },
    { id: "c4", nome: "Camila Rezende", telefone: "(11) 97777-3322", last_visit_date: iso(-3) },
    { id: "c5", nome: "Isabela Prado", telefone: "(31) 99654-0098", last_visit_date: iso(-210) },
  ],
  appointments: [
    { id: "a1", client_id: "c1", date: iso(0), time: "09:30", service: "Retorno", status: "Confirmado" },
    { id: "a2", client_id: "c3", date: iso(0), time: "11:00", service: "Análise Completa", status: "Pendente" },
    { id: "a3", client_id: "c4", date: iso(0), time: "15:30", service: "Retorno", status: "Confirmado" },
    { id: "a4", client_id: "c2", date: iso(1), time: "10:00", service: "Primeira Consulta", status: "Pendente" },
    { id: "a5", client_id: "c5", date: iso(3), time: "14:00", service: "Análise Completa", status: "Confirmado" },
  ],
  analyses: [
    {
      id: "n1", client_id: "c1", image_url: "", face_shape: "Oval", symmetry: 91, date: iso(-64),
      recommendations: { cabelo: "Long bob com camadas suaves", sobrancelha: "Arco natural levemente elevado", maquiagem: "Contorno sutil nas têmporas" },
    },
    {
      id: "n2", client_id: "c1", image_url: "", face_shape: "Oval", symmetry: 89, date: iso(-190),
      recommendations: { cabelo: "Franja cortina", sobrancelha: "Reta suavizada", maquiagem: "Iluminador no arco do cupido" },
    },
  ],
};

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const api = (path: string, init?: RequestInit) => fetch(`${API}${path}`, { headers: { "Content-Type": "application/json" }, ...init });

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));

export function useStore() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const actions = {
  addAppointment(a: Omit<Appointment, "id">) {
    state = { ...state, appointments: [...state.appointments, { ...a, id: uid() }] };
    void api("/appointments", { method: "POST", body: JSON.stringify(a) });
    emit();
  },
  toggleStatus(id: string) {
    state = {
      ...state,
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: a.status === "Confirmado" ? "Pendente" : "Confirmado" } : a,
      ),
    };
    emit();
  },
  addClient(nome: string, telefone = "") {
    const c: Client = { id: uid(), nome, telefone, last_visit_date: iso(0) };
    state = { ...state, clients: [...state.clients, c] };
    emit();
    return c;
  },
  addAnalysis(a: Omit<Analysis, "id">) {
    state = {
      ...state,
      analyses: [{ ...a, id: uid() }, ...state.analyses],
      clients: state.clients.map((c) => (c.id === a.client_id ? { ...c, last_visit_date: a.date } : c)),
    };
    emit();
  },
};

export const MOCK_RESULTS: Omit<Analysis, "id" | "client_id" | "image_url" | "date">[] = [
  {
    face_shape: "Oval", symmetry: 92,
    recommendations: {
      cabelo: "Long bob texturizado na altura da clavícula, com camadas que valorizam as maçãs do rosto.",
      sobrancelha: "Arco suave com pico no terço externo, mantendo espessura média natural.",
      maquiagem: "Contorno leve sob as maçãs, blush em direção às têmporas e iluminador no centro da testa.",
    },
  },
  {
    face_shape: "Coração", symmetry: 87,
    recommendations: {
      cabelo: "Comprimento médio com volume a partir do queixo; franja lateral longa para equilibrar a testa.",
      sobrancelha: "Curvatura arredondada e suave, evitando ângulos marcados.",
      maquiagem: "Contorno nas laterais da testa e iluminação no queixo para equilibrar proporções.",
    },
  },
  {
    face_shape: "Quadrado", symmetry: 89,
    recommendations: {
      cabelo: "Ondas suaves abaixo do ombro com repartição lateral para suavizar a mandíbula.",
      sobrancelha: "Arco definido e elevado, criando verticalidade.",
      maquiagem: "Contorno nos ângulos da mandíbula e blush aplicado em diagonal.",
    },
  },
];




