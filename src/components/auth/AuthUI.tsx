import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { supabase } from "@/integrations/api/client";

export function AuthScreen({ children, back }: { children: ReactNode; back?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
        {back && (
          <Link to={back} className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="flex flex-1 flex-col animate-rise">{children}</div>
      </div>
    </div>
  );
}

export function AuthTitle({ title, highlight, sub }: { title: string; highlight?: string; sub?: string }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="font-display text-3xl leading-tight">
        {title} {highlight && <span className="text-gold">{highlight}</span>}
      </h1>
      {sub && <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const [show, setShow] = useState(false);
  const isPw = props.type === "password";
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="relative">
        <input
          {...props}
          type={isPw && show ? "text" : props.type}
          className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
        />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Mostrar senha">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );
}

export function SelectField({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select {...props} className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm text-foreground outline-none focus:border-gold">
        <option value="">Selecione</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function GoldButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
      {children}
    </button>
  );
}

export function DarkButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card py-3.5 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50">
      {children}
    </button>
  );
}

export function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--gold)]" />
      <span>{children}</span>
    </label>
  );
}

export function ErrorText({ children }: { children?: string | null }) {
  if (!children) return null;
  return <p className="rounded-lg bg-destructive/15 px-3 py-2 text-xs text-destructive">{children}</p>;
}

export function translateAuthError(msg: string) {
  if (/invalid login/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Confirme seu e-mail antes de entrar.";
  if (/already registered/i.test(msg)) return "Este e-mail já está cadastrado.";
  if (/password/i.test(msg) && /characters/i.test(msg)) return "A senha precisa ter pelo menos 6 caracteres.";
  return msg;
}

/** Decides where a signed-in user goes: onboarding step or the app. */
export function useRouteAfterLogin() {
  const navigate = useNavigate();
  return async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data: p } = await supabase.from("profiles").select("account_type,onboarded").eq("id", u.user.id).maybeSingle();
    if (p && !p.onboarded) {
      navigate({ to: p.account_type === "cliente" ? "/completar-perfil" : "/cadastro-estabelecimento", replace: true });
    } else {
      navigate({ to: "/dashboard", replace: true });
    }
  };
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

