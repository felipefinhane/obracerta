import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";

export default async function MedicoesPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string; etapaId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId, etapaId } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access, via etapas) — sem lógica extra de
  // autorização aqui.
  const { data: etapa } = await supabase.from("etapas").select("nome").eq("id", etapaId).single();
  const { data: medicoes } = await supabase
    .from("medicoes")
    .select("id, data, percentual_concluido, observacao")
    .eq("etapa_id", etapaId)
    .order("data", { ascending: false });

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <div className="flex justify-between items-center gap-stack-md">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Medições — {etapa?.nome ?? "Etapa"}
        </h2>
        <Link
          href={`/obras/${obraId}/etapas/${etapaId}/medicoes/nova`}
          aria-label="Nova medição"
          className="h-touch-target-min px-3 bg-secondary-container text-on-secondary rounded flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <span aria-hidden className="material-symbols-outlined text-[18px]">
            add
          </span>
        </Link>
      </div>
      {erro && <ErrorBanner mensagem={erro} />}
      <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
        Medição simplificada — sem fluxo de aprovação nesta versão.
      </p>

      {medicoes && medicoes.length > 0 ? (
        <ul className="flex flex-col gap-stack-sm">
          {medicoes.map((m) => (
            <li
              key={m.id}
              className="bg-surface-container-lowest border border-outline-variant rounded p-3 font-body-md text-body-md"
            >
              <div className="flex justify-between items-center">
                <span className="text-on-surface">
                  {new Date(m.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
                <span className="text-primary font-label-bold text-label-bold">{m.percentual_concluido}%</span>
              </div>
              {m.observacao && <p className="text-on-surface-variant text-[12px] mt-1">{m.observacao}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma medição lançada ainda.</p>
      )}
    </main>
  );
}
