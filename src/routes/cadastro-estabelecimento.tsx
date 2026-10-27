import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Scissors, Sparkles, Store } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/api/client";
import { AuthScreen, AuthTitle, ErrorText, Field, GoldButton } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/cadastro-estabelecimento")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Cadastro de barbearia ou salão — ProvAI" },
      { name: "description", content: "Cadastre sua barbearia ou salão de beleza na ProvAI." },
      { property: "og:title", content: "Cadastro de barbearia ou salão — ProvAI" },
      { property: "og:description", content: "Leve o visagismo com IA para o seu negócio." },
    ],
  }),
  component: Estabelecimento,
});

function Estabelecimento() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<"barbearia" | "salao">("barbearia");
  const [f, setF] = useState({ name: "", document: "", phone: "", address: "", city: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  // Preselect from the type chosen at signup
  useState(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase.from("profiles").select("account_type").eq("id", data.user.id).maybeSingle();
      if (p?.account_type === "salao") setKind("salao");
    });
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user!.id;
    const { error } = await supabase.from("establishments").insert({ ...f, kind, owner_id: uid });
    if (!error) await supabase.from("profiles").update({ onboarded: true, account_type: kind }).eq("id", uid);
    setBusy(false);
    if (error) return setErr("Não foi possível salvar. Tente novamente.");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <AuthScreen>
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 text-gold">
        <Store className="h-10 w-10" strokeWidth={1} />
      </div>
      <AuthTitle title="Cadastre seu" highlight="negócio" sub="Barbearias e salões usam a IA para encantar seus clientes." />
      <div className="mb-5 grid grid-cols-2 gap-2">
        {([["barbearia", "Barbearia", Scissors], ["salao", "Salão de beleza", Sparkles]] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" onClick={() => setKind(id)}
            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm ${kind === id ? "border-gold bg-accent text-gold" : "border-border text-muted-foreground"}`}>
            <Icon className="h-4 w-4" strokeWidth={1.5} /> {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <Field placeholder={kind === "barbearia" ? "Nome da barbearia" : "Nome do salão"} value={f.name} onChange={set("name")} required />
        <Field placeholder="CNPJ ou CPF (opcional)" value={f.document} onChange={set("document")} />
        <Field type="tel" placeholder="Telefone / WhatsApp" value={f.phone} onChange={set("phone")} required />
        <Field placeholder="Endereço" value={f.address} onChange={set("address")} required />
        <Field placeholder="Cidade / UF" value={f.city} onChange={set("city")} required />
        <ErrorText>{err}</ErrorText>
        <GoldButton disabled={busy}>{busy ? "Salvando…" : "Finalizar cadastro"}</GoldButton>
      </form>
    </AuthScreen>
  );
}

