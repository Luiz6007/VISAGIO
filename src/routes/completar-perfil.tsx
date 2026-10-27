import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { UserCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/api/client";
import { AuthScreen, AuthTitle, Check, ErrorText, Field, GoldButton, SelectField } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/completar-perfil")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Complete seu perfil — ProvAI" },
      { name: "description", content: "Conte mais sobre você para personalizar seu visagismo." },
      { property: "og:title", content: "Complete seu perfil — ProvAI" },
      { property: "og:description", content: "Falta pouco para começar." },
    ],
  }),
  component: Perfil,
});

const GENDERS = ["Masculino", "Feminino", "Outro"];

function Perfil() {
  const navigate = useNavigate();
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [objective, setObjective] = useState("");
  const [profession, setProfession] = useState("");
  const [referral, setReferral] = useState("");
  const [news, setNews] = useState(true);
  const [terms, setTerms] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) return setErr("Aceite os Termos de Uso para continuar.");
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ birth_date: birth || null, gender, objective, profession, referral, onboarded: true })
      .eq("id", u.user!.id);
    setBusy(false);
    if (error) return setErr("Não foi possível salvar. Tente novamente.");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <AuthScreen>
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 text-gold">
        <UserCircle2 className="h-12 w-12" strokeWidth={1} />
      </div>
      <AuthTitle title="Falta pouco! Conte mais" highlight="sobre você" sub="Essas informações ajudam nossa IA a te conhecer melhor." />
      <form onSubmit={submit} className="space-y-4">
        <Field label="Data de nascimento" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((g) => (
            <button type="button" key={g} onClick={() => setGender(g)}
              className={`rounded-xl border py-2.5 text-xs ${gender === g ? "border-gold bg-accent text-gold" : "border-border text-muted-foreground"}`}>{g}</button>
          ))}
        </div>
        <SelectField label="Seu objetivo" value={objective} onChange={(e) => setObjective(e.target.value)}
          options={["Mudar o visual", "Valorizar meus traços", "Imagem profissional", "Ocasião especial"]} />
        <Field label="Profissão (opcional)" placeholder="Ex: Advogada, Designer…" value={profession} onChange={(e) => setProfession(e.target.value)} />
        <SelectField label="Onde conheceu a ProvAI? (opcional)" value={referral} onChange={(e) => setReferral(e.target.value)}
          options={["Instagram", "Google", "Indicação", "Barbearia / Salão", "Outro"]} />
        <div className="space-y-3 pt-1">
          <Check checked={news} onChange={setNews}>Quero receber dicas de visagismo e promoções.</Check>
          <Check checked={terms} onChange={setTerms}>
            Concordo com os <span className="text-gold">Termos de Uso</span> e <span className="text-gold">Política de Privacidade</span>
          </Check>
        </div>
        <ErrorText>{err}</ErrorText>
        <GoldButton disabled={busy}>{busy ? "Salvando…" : "Finalizar cadastro"}</GoldButton>
      </form>
    </AuthScreen>
  );
}

