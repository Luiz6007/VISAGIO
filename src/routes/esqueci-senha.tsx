import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, MailCheck } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/api/client";
import { AuthScreen, AuthTitle, ErrorText, Field, GoldButton } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — ProvAI" },
      { name: "description", content: "Receba um link para redefinir a senha da sua conta ProvAI." },
      { property: "og:title", content: "Recuperar senha — ProvAI" },
      { property: "og:description", content: "Redefina sua senha." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (error) return setErr("Não foi possível enviar. Tente novamente em instantes.");
    setSent(true);
  };

  return (
    <AuthScreen back="/login">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 text-gold">
        {sent ? <MailCheck className="h-10 w-10" strokeWidth={1} /> : <KeyRound className="h-10 w-10" strokeWidth={1} />}
      </div>
      {sent ? (
        <>
          <AuthTitle title="Verifique seu" highlight="e-mail" sub={`Se houver uma conta para ${email}, você receberá um link para criar uma nova senha.`} />
          <Link to="/login" className="text-center text-sm text-gold">Voltar ao login</Link>
        </>
      ) : (
        <>
          <AuthTitle title="Esqueceu sua" highlight="senha?" sub="Informe seu e-mail e enviaremos um link para redefini-la." />
          <form onSubmit={submit} className="space-y-4">
            <Field type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <ErrorText>{err}</ErrorText>
            <GoldButton disabled={busy}>{busy ? "Enviando…" : "Enviar link"}</GoldButton>
          </form>
        </>
      )}
    </AuthScreen>
  );
}

