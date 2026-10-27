import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/api/client";
import { AuthScreen, AuthTitle, ErrorText, Field, GoldButton, translateAuthError, useRouteAfterLogin } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar com e-mail — ProvAI" },
      { name: "description", content: "Entre na sua conta ProvAI com e-mail e senha." },
      { property: "og:title", content: "Entrar com e-mail — ProvAI" },
      { property: "og:description", content: "Entre com e-mail e senha." },
    ],
  }),
  component: Login,
});

function Login() {
  const go = useRouteAfterLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setErr(translateAuthError(error.message));
    go();
  };

  return (
    <AuthScreen back="/auth">
      <AuthTitle title="Bem-vindo" highlight="de volta" sub="Entre com seu e-mail e senha" />
      <form onSubmit={submit} className="space-y-4">
        <Field type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="text-right">
          <Link to="/esqueci-senha" className="text-xs text-gold">Esqueceu sua senha?</Link>
        </div>
        <ErrorText>{err}</ErrorText>
        <GoldButton disabled={busy}>{busy ? "Entrando…" : "Entrar"}</GoldButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta? <Link to="/cadastro" className="text-gold">Cadastre-se</Link>
      </p>
    </AuthScreen>
  );
}

