import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Brush, Eye, RotateCcw, Scissors, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/AppShell";
import { actions, MOCK_RESULTS, useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/analise")({
  head: () => ({
    meta: [
      { title: "Nova Análise IA — Visage" },
      { name: "description", content: "Faça o upload da foto do rosto e gere a análise de visagismo com IA." },
      { property: "og:title", content: "Nova Análise IA — Visage" },
      { property: "og:description", content: "Análise de visagismo facial com inteligência artificial." },
    ],
  }),
  component: Analise,
});

type Phase = "upload" | "scanning" | "result";

function Analise() {
  const { clients } = useStore();
  const [img, setImg] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [drag, setDrag] = useState(false);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [result, setResult] = useState(MOCK_RESULTS[0]!);
  const [saved, setSaved] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = (f?: File) => {
    if (!f || !f.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = () => setImg(r.result as string);
    r.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!img) return;
    setPhase("scanning");
    setSaved(false);
    try {
      const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
      const response = await fetch(`${base}/analyses/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image_url: img, client_id: clientId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível analisar a imagem.");
      setResult(data);
      setPhase("result");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha na análise de IA");
      setPhase("upload");
    }
  };
  const reset = () => {
    setImg(null);
    setPhase("upload");
  };

  const save = () => {
    if (!img || !clientId) return;
    actions.addAnalysis({ ...result, client_id: clientId, image_url: img, date: new Date().toISOString().slice(0, 10) });
    setSaved(true);
    toast.success("Análise salva no histórico do cliente");
  };

  return (
    <div className="animate-rise">
      <PageTitle eyebrow="Inteligência Artificial" title="Nova Análise" />

      <div className={phase === "result" ? "grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]" : "mx-auto max-w-xl"}>
        <div className="card-lux overflow-hidden p-3">
          {!img ? (
            <button
              type="button"
              onClick={() => input.current?.click()}
              onDragOver={(e) => (e.preventDefault(), setDrag(true))}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                load(e.dataTransfer.files[0]);
              }}
              className={`flex aspect-[4/5] w-full flex-col items-center justify-center rounded-2xl border border-dashed transition-colors ${
                drag ? "border-gold bg-accent" : "border-border bg-muted"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Upload className="h-6 w-6" strokeWidth={1.3} />
              </div>
              <p className="mt-5 font-display text-2xl">Arraste a foto aqui</p>
              <p className="mt-1 text-xs text-muted-foreground">ou toque para selecionar · rosto frontal, boa iluminação</p>
            </button>
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <img src={img} alt="Rosto do cliente" className="h-full w-full object-cover" />
              {phase === "scanning" && (
                <div className="absolute inset-0 bg-primary/30">
                  <div className="absolute inset-x-0 h-0.5 animate-scan bg-gold shadow-[0_0_24px_4px] shadow-gold" />
                  <div className="absolute inset-x-0 bottom-6 text-center">
                    <span className="rounded-full bg-card/90 px-4 py-2 text-xs tracking-wide">
                      <Sparkles className="mr-2 inline h-3.5 w-3.5 animate-pulse text-gold" />
                      Escaneando proporções faciais…
                    </span>
                  </div>
                </div>
              )}
              {phase === "result" && <FaceMap />}
            </div>
          )}
          <input ref={input} type="file" accept="image/*" hidden onChange={(e) => load(e.target.files?.[0])} />

          {phase !== "result" && (
            <div className="space-y-3 p-3">
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              <button
                disabled={!img || phase === "scanning"}
                onClick={analyze}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                {phase === "scanning" ? "Analisando…" : "Analisar Rosto com IA"}
              </button>
            </div>
          )}
        </div>

        {phase === "result" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card-lux animate-rise p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Formato do rosto</p>
                <p className="mt-2 font-display text-4xl">{result.face_shape}</p>
              </div>
              <div className="card-lux animate-rise p-5" style={{ animationDelay: "120ms" }}>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Simetria</p>
                <p className="mt-2 font-display text-4xl">{result.symmetry}%</p>
                <div className="mt-3 h-1 rounded-full bg-muted">
                  <div className="h-1 rounded-full bg-gold" style={{ width: `${result.symmetry}%` }} />
                </div>
              </div>
            </div>
            {[
              { icon: Scissors, t: "Corte de cabelo", d: result.recommendations.cabelo },
              { icon: Eye, t: "Sobrancelha", d: result.recommendations.sobrancelha },
              { icon: Brush, t: "Maquiagem", d: result.recommendations.maquiagem },
            ].map((r, i) => (
              <div key={r.t} className="card-lux flex animate-rise gap-4 p-5" style={{ animationDelay: `${240 + i * 120}ms` }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-gold">
                  <r.icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-xl">{r.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.d}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                disabled={saved}
                className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {saved ? "Salvo no histórico" : "Salvar no perfil"}
              </button>
              <button onClick={reset} className="flex items-center gap-2 rounded-xl border border-border px-5 text-sm">
                <RotateCcw className="h-4 w-4" /> Nova
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FaceMap() {
  const pts = [
    [50, 18], [30, 30], [70, 30], [36, 44], [64, 44], [50, 56], [40, 68], [60, 68], [50, 82], [24, 50], [76, 50],
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <g className="stroke-gold" fill="none" strokeWidth="0.3">
        <ellipse cx="50" cy="50" rx="27" ry="35" className="animate-draw" />
        <path d="M50 12 L50 90" className="animate-draw" strokeDasharray="1 1" />
        <path d="M22 44 L78 44 M26 68 L74 68 M30 30 L70 30" className="animate-draw" />
        <path d="M36 44 L50 56 L64 44 M40 68 L50 82 L60 68 M24 50 L40 68 M76 50 L60 68" className="animate-draw" />
      </g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" className="animate-rise fill-gold" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </svg>
  );
}

