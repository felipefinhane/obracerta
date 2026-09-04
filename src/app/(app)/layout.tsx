import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "./AppHeader";
import { SincronizacaoOffline } from "./SincronizacaoOffline";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Middleware (src/lib/supabase/middleware.ts) já garante sessão pra
  // qualquer rota deste grupo — user só vem null numa janela de corrida
  // improvável entre o redirect e este render.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <AppHeader userEmail={user?.email ?? null} />
      {children}
      <SincronizacaoOffline />
    </div>
  );
}
