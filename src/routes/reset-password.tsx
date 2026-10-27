import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/api/client";
import { AuthScreen, AuthTitle, ErrorText, Field, GoldButton } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — ProvAI" },
      { name: "description", content: "Crie uma nova senha para sua conta ProvAI." },
      { property: "og:title", content: "Nova senha — ProvAI" },
      { property: "og:description", content: "Crie uma nova senha." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (pw.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    if (pw !== pw2) return setErr("As senhas não coincidem.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr("Link inválido ou expirado. Solicite um novo.");
    toast.success("Senha alterada com sucesso");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <AuthScreen>
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 text-gold">
        <LockKeyhole className="h-10 w-10" strokeWidth={1} />
      </div>
      <AuthTitle title="Crie uma" highlight="nova senha" />
      <form onSubmit={submit} className="space-y-4">
        <Field type="password" placeholder="Nova senha" value={pw} onChange={(e) => setPw(e.target.value)} required />
        <Field type="password" placeholder="Confirmar nova senha" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
        <ErrorText>{err}</ErrorText>
        <GoldButton disabled={busy}>{busy ? "Salvando…" : "Salvar nova senha"}</GoldButton>
      </form>
    </AuthScreen>
  );
}

