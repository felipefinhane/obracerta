import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSignedStorageUrl } from "@/lib/storage/signed-url";

const CLIMA_LABEL: Record<string, string> = {
  ensolarado: "Ensolarado",
  parcialmente_nublado: "Parcialmente nublado",
  nublado: "Nublado",
  chuvoso: "Chuvoso",
};

export default async function DiarioObraPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();
  const { data: entradasRaw } = await supabase
    .from("diario_entradas")
    .select("id, data, clima, descricao, efetivo_presente, ocorrencias, etapas(nome), diario_midia(id)")
    .eq("obra_id", obraId)
    .order("data", { ascending: false });

  const entradas = await Promise.all(
    (entradasRaw ?? []).map(async (entrada) => {
      const etapa = Array.isArray(entrada.etapas) ? entrada.etapas[0] : entrada.etapas;
      const midias = entrada.diario_midia ?? [];
      const fotos = await Promise.all(
        midias.map(async (m) => (await getSignedStorageUrl(supabase, "diario_midia", m.id, "read"))?.url ?? null),
      );
      return { ...entrada, etapaNome: etapa?.nome ?? null, fotos: fotos.filter((f): f is string => f != null) };
    }),
  );

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
        <div className="flex justify-between items-center gap-stack-md">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Diário de Obra — {obra?.nome ?? "Obra"}
          </h2>
          <Link
            href={`/obras/${obraId}/diario/novo`}
            className="h-touch-target-min px-4 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <span aria-hidden className="material-symbols-outlined text-[18px]">
              add
            </span>
            <span className="hidden sm:inline">Novo lançamento</span>
          </Link>
        </div>

        {entradas.length > 0 ? (
          <ul className="flex flex-col gap-stack-md">
            {entradas.map((e) => (
              <li
                key={e.id}
                className={`bg-surface-container-lowest border rounded-lg p-stack-md flex flex-col gap-stack-sm font-body-md text-body-md ${
                  e.ocorrencias ? "border-l-4 border-error border-t border-r border-b border-outline-variant" : "border-outline-variant"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-headline-md text-primary">
                    {new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-on-surface-variant text-[12px]">
                    {[e.clima ? CLIMA_LABEL[e.clima] ?? e.clima : null, e.etapaNome].filter(Boolean).join(" · ")}
                  </span>
                </div>

                {e.descricao && <p className="text-on-surface">{e.descricao}</p>}

                <div className="flex gap-stack-md text-on-surface-variant text-[12px]">
                  {e.efetivo_presente != null && (
                    <span className="flex items-center gap-1">
                      <span aria-hidden className="material-symbols-outlined text-[16px]">
                        groups
                      </span>
                      {e.efetivo_presente} pessoas
                    </span>
                  )}
                </div>

                {e.ocorrencias && (
                  <p className="text-error text-[12px] flex items-center gap-1">
                    <span aria-hidden className="material-symbols-outlined text-[16px]">
                      warning
                    </span>
                    {e.ocorrencias}
                  </p>
                )}

                {e.fotos.length > 0 && (
                  <div className="flex gap-stack-sm overflow-x-auto">
                    {e.fotos.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element -- URL assinada de curta duração
                      <img
                        key={i}
                        src={url}
                        alt={`Foto ${i + 1} do lançamento de ${e.data}`}
                        className="w-24 h-24 object-cover rounded border border-outline-variant flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhum lançamento ainda.</p>
        )}
      </main>
    </>
  );
}
