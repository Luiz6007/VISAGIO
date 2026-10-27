import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck, Scissors, Sparkles, User, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/api/client";
import { AuthScreen, AuthTitle, Check, ErrorText, Field, GoldButton, translateAuthError } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — ProvAI" },
      { name: "description", content: "Crie sua conta ProvAI como cliente, barbearia ou salão de beleza." },
      { property: "og:title", content: "Criar conta — ProvAI" },
      { property: "og:description", content: "Cadastro de clientes, barbearias e salões de beleza." },
    ],
  }),
  component: Cadastro,
});

const TYPES = [
  { id: "cliente", label: "Cliente", icon: User },
  { id: "barbearia", label: "Barbearia", icon: Scissors },
  { id: "salao", label: "Salão", icon: Sparkles },
] as const;

function Cadastro() {
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("cliente");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!terms) return setErr("Aceite os Termos de Uso para continuar.");
    if (password.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: nome, phone, account_type: type },
      },
    });
    setBusy(false);
    if (error) return setErr(translateAuthError(error.message));
    setSent(true);
  };

  if (sent)
    return (
      <AuthScreen back="/auth">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <MailCheck className="h-14 w-14 text-gold" strokeWidth={1.2} />
          <AuthTitle title="Confirme seu" highlight="e-mail" sub={`Enviamos um link para ${email}. Abra-o para ativar sua conta e continuar o cadastro.`} />
          <Link to="/login" className="text-sm text-gold">Ir para o login</Link>
        </div>
      </AuthScreen>
    );

  return (
    <AuthScreen back="/auth">
      <p className="text-center font-display text-lg italic">Criar conta</p>
      <AuthTitle title="Preencha seus dados" sub="para criar sua conta" />
      <div className="mx-auto -mt-4 mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 text-gold">
        <UserCircle2 className="h-12 w-12" strokeWidth={1} />
      </div>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs transition-colors ${
              type === t.id ? "border-gold bg-accent text-gold" : "border-border text-muted-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" strokeWidth={1.5} /> {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <Field placeholder={type === "cliente" ? "Nome completo" : "Nome do responsável"} value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Field type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field type="tel" placeholder="Telefone (opcional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Field type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="pt-1">
          <Check checked={terms} onChange={setTerms}>
            Concordo com os <span className="text-gold">Termos de Uso</span> e <span className="text-gold">Política de Privacidade</span>
          </Check>
        </div>
        <ErrorText>{err}</ErrorText>
        <GoldButton disabled={busy}>{busy ? "Criando…" : "Criar conta"}</GoldButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tenho uma conta? <Link to="/login" className="text-gold">Entrar</Link>
      </p>
    </AuthScreen>
  );
}

