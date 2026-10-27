import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/api/client";
import { lovable } from "@/integrations/lovable/index";
import hero from "@/assets/hero-visagismo.jpg";
import { DarkButton, GoldButton, GoogleIcon, useRouteAfterLogin } from "./AuthUI";

export function Landing() {
  const go = useRouteAfterLogin();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const social = async (provider: "google" | "apple") => {
    setBusy(true);
    const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (r.error) {
      toast.error("Não foi possível entrar. Tente novamente.");
      setBusy(false);
      return;
    }
    if (r.redirected) return;
    go();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        <div className="relative">
          <img src={hero} alt="Mapeamento facial de visagismo" width={1024} height={768} className="aspect-[4/3.6] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute bottom-4 right-6 text-right">
            <p className="font-display text-2xl tracking-[0.2em] text-gold">VISAGISMO</p>
            <p className="text-[11px] text-muted-foreground">harmonia que revela<br />quem você é</p>
          </div>
        </div>
        <div className="flex flex-1 animate-rise flex-col justify-center gap-3 px-6 pb-10 pt-4">
          <Link to="/login" className="w-full">
            <GoldButton type="button"><Mail className="h-5 w-5" strokeWidth={1.5} /> Entrar com e-mail</GoldButton>
          </Link>
          <DarkButton type="button" disabled={busy} onClick={() => social("google")}><GoogleIcon /> Entrar com Google</DarkButton>
          <DarkButton type="button" disabled={busy} onClick={() => social("apple")}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.3-2.7 1.4-2.8-.1 0-2.4-.9-2.4-4.2zM13.9 5c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" /></svg>
            Entrar com Apple
          </DarkButton>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Ainda não tem uma conta? <Link to="/cadastro" className="text-gold">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

