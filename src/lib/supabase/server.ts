import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pro server (Server Components, Route Handlers, Server
 * Actions). Lê/escreve a sessão via cookies do Next.js, mesmo princípio do
 * client de browser: sem ORM, RLS como fonte de verdade (ADR 0001).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component — ignorável se
            // houver middleware renovando a sessão.
          }
        },
      },
    },
  );
}
