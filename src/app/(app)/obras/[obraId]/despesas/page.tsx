import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ExtratoDespesas } from "./ExtratoDespesas";

export default async function ExtratoDespesasPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: obra } = await supabase.from("obras").select("nome, construtora_id").eq("id", obraId).single();

  const [{ data: despesasRaw }, { data: categorias }, { data: fornecedores }] = await Promise.all([
    supabase
      .from("despesas")
      .select(
        "id, data_despesa, valor, forma_pagamento, descricao, categoria_id, fornecedor_id, categorias(nome), fornecedores(nome)",
      )
      .eq("obra_id", obraId)
      .eq("status", "confirmada")
      .order("data_despesa", { ascending: false, nullsFirst: false }),
    supabase
      .from("categorias")
      .select("id, nome")
      .eq("construtora_id", obra?.construtora_id ?? "")
      .order("nome"),
    supabase
      .from("fornecedores")
      .select("id, nome")
      .eq("construtora_id", obra?.construtora_id ?? "")
      .order("nome"),
  ]);

  // categorias/fornecedores vêm embutidos como objeto único (FK simples,
  // não unique do outro lado) — mesmo tratamento defensivo dos tickets 04/05.
  const despesas = (despesasRaw ?? []).map((d) => {
    const categoria = Array.isArray(d.categorias) ? d.categorias[0] : d.categorias;
    const fornecedor = Array.isArray(d.fornecedores) ? d.fornecedores[0] : d.fornecedores;
    return {
      id: d.id,
      data_despesa: d.data_despesa,
      valor: d.valor,
      forma_pagamento: d.forma_pagamento,
      descricao: d.descricao,
      categoria_id: d.categoria_id,
      fornecedor_id: d.fornecedor_id,
      categoria_nome: categoria?.nome ?? null,
      fornecedor_nome: fornecedor?.nome ?? null,
    };
  });

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Despesas — {obra?.nome ?? "Obra"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-stack-sm">
            <Link
              href={`/obras/${obraId}/despesas/pendentes`}
              className="h-touch-target-min px-4 border border-outline text-on-surface font-button-text text-button-text rounded flex items-center gap-2 hover:bg-surface-container-lowest transition-colors"
            >
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                pending_actions
              </span>
              Pendentes
            </Link>
            <Link
              href={`/obras/${obraId}/despesas/capturar`}
              className="h-touch-target-min px-4 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                photo_camera
              </span>
              Fotografar recibo
            </Link>
            <Link
              href={`/obras/${obraId}/despesas/nova`}
              className="h-touch-target-min px-4 border border-outline text-on-surface font-button-text text-button-text rounded flex items-center gap-2 hover:bg-surface-container-lowest transition-colors"
            >
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                add
              </span>
              Nova despesa manual
            </Link>
          </div>
        </div>

        <ExtratoDespesas obraId={obraId} despesas={despesas} categorias={categorias ?? []} fornecedores={fornecedores ?? []} />
      </main>
    </>
  );
}
