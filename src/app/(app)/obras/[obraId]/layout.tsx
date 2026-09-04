import { createClient } from "@/lib/supabase/server";
import { ObraSubNav } from "./ObraSubNav";

export default async function ObraLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();

  return (
    <>
      <ObraSubNav obraId={obraId} obraNome={obra?.nome ?? "Obra"} />
      {children}
    </>
  );
}
