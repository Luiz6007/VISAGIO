import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/auth/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProvAI — Visagismo com IA" },
      { name: "description", content: "Entre na sua conta ProvAI e descubra o visagismo ideal com inteligência artificial." },
      { property: "og:title", content: "ProvAI — Visagismo com IA" },
      { property: "og:description", content: "Harmonia que revela quem você é. Visagismo com IA para clientes, barbearias e salões." },
    ],
  }),
  component: Landing,
});

