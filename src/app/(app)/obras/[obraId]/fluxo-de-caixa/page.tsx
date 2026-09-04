import { createClient } from "@/lib/supabase/server";

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarMes(chave: string) {
  const [ano, mes] = chave.split("-");
  return new Date(Number(ano), Number(mes) - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export default async function FluxoDeCaixaPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const [{ data: recebimentos }, { data: despesas }] = await Promise.all([
    supabase.from("recebimentos").select("valor, data").eq("obra_id", obraId),
    supabase.from("despesas").select("valor, data_despesa").eq("obra_id", obraId).eq("status", "confirmada"),
  ]);

  const porMes = new Map<string, { entradas: number; saidas: number }>();
  function mesDe(data: string) {
    return data.slice(0, 7); // YYYY-MM
  }
  for (const r of recebimentos ?? []) {
    const chave = mesDe(r.data);
    const atual = porMes.get(chave) ?? { entradas: 0, saidas: 0 };
    atual.entradas += r.valor ?? 0;
    porMes.set(chave, atual);
  }
  for (const d of despesas ?? []) {
    if (!d.data_despesa) continue; // despesa manual/confirmada pode não ter data preenchida
    const chave = mesDe(d.data_despesa);
    const atual = porMes.get(chave) ?? { entradas: 0, saidas: 0 };
    atual.saidas += d.valor ?? 0;
    porMes.set(chave, atual);
  }

  const meses = [...porMes.keys()].sort();
  const linhas = meses.reduce<{ chave: string; entradas: number; saidas: number; saldoMes: number; saldoAcumulado: number }[]>(
    (acc, chave) => {
      const { entradas, saidas } = porMes.get(chave)!;
      const saldoMes = entradas - saidas;
      const saldoAnterior = acc.length > 0 ? acc[acc.length - 1].saldoAcumulado : 0;
      return [...acc, { chave, entradas, saidas, saldoMes, saldoAcumulado: saldoAnterior + saldoMes }];
    },
    [],
  );

  const totalEntradas = linhas.reduce((s, l) => s + l.entradas, 0);
  const totalSaidas = linhas.reduce((s, l) => s + l.saidas, 0);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Fluxo de Caixa
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-sm">
        <div className="bg-primary-container p-stack-md rounded-lg">
          <span className="font-label-bold text-label-bold text-on-primary-container uppercase text-[12px]">
            Entradas
          </span>
          <p className="font-headline-md text-headline-md text-on-primary-container">{formatarMoeda(totalEntradas)}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-lg">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase text-[12px]">
            Saídas
          </span>
          <p className="font-headline-md text-headline-md text-on-surface">{formatarMoeda(totalSaidas)}</p>
        </div>
        <div
          className={`p-stack-md rounded-lg ${totalEntradas - totalSaidas < 0 ? "bg-error-container" : "bg-secondary-container"}`}
        >
          <span className="font-label-bold text-label-bold uppercase text-[12px] text-on-surface">Saldo</span>
          <p className="font-headline-md text-headline-md text-on-surface">
            {formatarMoeda(totalEntradas - totalSaidas)}
          </p>
        </div>
      </div>

      {linhas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-body-md text-body-md">
            <thead>
              <tr className="border-b-2 border-outline-variant text-left text-on-surface-variant text-[12px] uppercase">
                <th className="py-2 pr-4">Mês</th>
                <th className="py-2 pr-4 text-right">Entradas</th>
                <th className="py-2 pr-4 text-right">Saídas</th>
                <th className="py-2 pr-4 text-right">Saldo do mês</th>
                <th className="py-2 text-right">Saldo acumulado</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.chave} className="border-b border-outline-variant">
                  <td className="py-2 pr-4 text-on-surface capitalize">{formatarMes(l.chave)}</td>
                  <td className="py-2 pr-4 text-right text-on-surface">{formatarMoeda(l.entradas)}</td>
                  <td className="py-2 pr-4 text-right text-on-surface">{formatarMoeda(l.saidas)}</td>
                  <td className={`py-2 pr-4 text-right ${l.saldoMes < 0 ? "text-error" : "text-on-surface"}`}>
                    {formatarMoeda(l.saldoMes)}
                  </td>
                  <td className={`py-2 text-right font-label-bold text-label-bold ${l.saldoAcumulado < 0 ? "text-error" : "text-on-surface"}`}>
                    {formatarMoeda(l.saldoAcumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Nenhum recebimento ou despesa com data lançada ainda.
        </p>
      )}
    </main>
  );
}
