import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";

const TIPO_LABEL: Record<string, string> = {
  parcela_financiamento: "Parcela de financiamento",
  aporte_cliente: "Aporte do cliente",
};

export default async function RecebimentosPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: recebimentos } = await supabase
    .from("recebimentos")
    .select("id, tipo, valor, data, descricao, etapas(nome)")
    .eq("obra_id", obraId)
    .order("data", { ascending: false });

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Recebimentos
        </h2>
        <Link
          href={`/obras/${obraId}/recebimentos/novo`}
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <span aria-hidden className="material-symbols-outlined text-[18px]">
            add
          </span>
          Novo Recebimento
        </Link>
      </div>
      {erro && <ErrorBanner mensagem={erro} />}

      {recebimentos && recebimentos.length > 0 ? (
        <ul className="flex flex-col gap-stack-sm">
          {recebimentos.map((r) => {
            const etapa = Array.isArray(r.etapas) ? r.etapas[0] : r.etapas;
            return (
              <li
                key={r.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md"
              >
                <div className="flex flex-col">
                  <span className="text-on-surface">{r.descricao || TIPO_LABEL[r.tipo] || r.tipo}</span>
                  <span className="text-on-surface-variant text-[12px]">
                    {[
                      new Date(r.data + "T00:00:00").toLocaleDateString("pt-BR"),
                      TIPO_LABEL[r.tipo] ?? r.tipo,
                      etapa?.nome,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <span className="text-primary font-label-bold text-label-bold whitespace-nowrap">
                  {r.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">Nenhum recebimento lançado ainda.</p>
      )}
    </main>
  );
}
