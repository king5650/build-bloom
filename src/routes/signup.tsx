import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AuthPanel } from "@/components/auth/AuthPanel";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Créer un compte client — A.S Africa" },
    { name: "description", content: "Créez votre compte A.S Africa pour suivre vos commandes et accélérer vos achats." },
    { property: "og:title", content: "Créer un compte — A.S Africa" },
    { property: "og:description", content: "Track orders and check out faster with an A.S Africa customer account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: SignupPage,
});

function SignupPage() {
  const { redirect } = Route.useSearch();
  return <AuthPanel mode="signup" redirect={redirect} />;
}