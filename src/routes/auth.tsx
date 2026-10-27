import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/auth/Landing";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — ProvAI" },
      { name: "description", content: "Acesse sua conta ProvAI com e-mail, Google ou Apple." },
      { property: "og:title", content: "Entrar — ProvAI" },
      { property: "og:description", content: "Acesse sua conta ProvAI." },
    ],
  }),
  component: Landing,
});

