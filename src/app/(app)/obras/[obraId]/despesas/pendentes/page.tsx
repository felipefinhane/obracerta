import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RefreshButton } from "./RefreshButton";

const STATUS_LABEL: Record<string, { texto: string; classe: string }> = {
  aguardando_upload: { texto: "Aguardando upload", classe: "bg-surface-container text-on-surface-variant" },
  pendente: { texto: "Processando…", classe: "bg-primary-container text-on-primary-container" },
  processado: { texto: "Pronto pra revisar", classe: "bg-secondary-container text-on-secondary" },
  falhou: { texto: "Extração falhou — revisar manualmente", classe: "bg-error-container text-on-error-container" },
};

export default async function RecibosPendentesPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: pendentes } = await supabase
    .from("despesas")
    .select("id, criado_em, recibos(status_processamento)")
    .eq("obra_id", obraId)
    .eq("status", "pendente_confirmacao")
    .order("criado_em", { ascending: false });

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Recibos pendentes
          </h2>
          <RefreshButton />
        </div>

        {pendentes && pendentes.length > 0 ? (
          <ul className="flex flex-col gap-stack-sm">
            {pendentes.map((p) => {
              // recibos vem embutido pela FK única (recibos.despesa_id) —
              // objeto único, não array, mas trata os dois formatos por
              // segurança (comportamento de embed do PostgREST já mudou de
              // versão pra versão nesse projeto).
              const recibo = Array.isArray(p.recibos) ? p.recibos[0] : p.recibos;
              const status = recibo?.status_processamento ?? "aguardando_upload";
              const info = STATUS_LABEL[status] ?? STATUS_LABEL.aguardando_upload;
              const revisavel = status === "processado" || status === "falhou";

              const conteudo = (
                <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md">
                  <span className="text-on-surface">
                    {new Date(p.criado_em).toLocaleString("pt-BR")}
                  </span>
                  <span className={`text-[12px] px-2 py-1 rounded ${info.classe}`}>{info.texto}</span>
                </div>
              );

              return (
                <li key={p.id}>
                  {revisavel ? (
                    <Link href={`/obras/${obraId}/despesas/${p.id}/confirmar`} className="block">
                      {conteudo}
                    </Link>
                  ) : (
                    conteudo
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhum recibo pendente de confirmação.</p>
        )}
      </main>
    </>
  );
}
