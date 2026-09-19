import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AuthPanel } from "@/components/auth/AuthPanel";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Connexion client — A.S Africa" },
    { name: "description", content: "Connectez-vous à votre espace client A.S Africa pour retrouver vos commandes et demandes." },
    { property: "og:title", content: "Connexion client — A.S Africa" },
    { property: "og:description", content: "Access your A.S Africa orders and requests securely." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  return <AuthPanel mode="login" redirect={redirect} />;
}