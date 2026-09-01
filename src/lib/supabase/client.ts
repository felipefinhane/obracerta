import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pro browser. Sem ORM (ADR 0001) — propaga a sessão do
 * usuário logado em cada chamada, o que faz a RLS avaliar as policies
 * (`has_obra_access` / `has_construtora_access`) usando o JWT da sessão.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
