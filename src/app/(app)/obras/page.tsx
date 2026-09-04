import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const supabase = await createClient();

  // RLS já filtra pro que o usuário tem acesso (has_obra_access) — sem
  // lógica extra de autorização aqui.
  const { data: obras } = await supabase
    .from("obras")
    .select("id, nome, endereco, cliente_nome, valor_planejado_total")
    .order("criado_em", { ascending: false });

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        {erro && <ErrorBanner mensagem={erro} />}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Obras
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Gerencie e acompanhe o progresso das suas obras.
            </p>
          </div>
          <Link
            href="/obras/nova"
            className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <span aria-hidden className="material-symbols-outlined text-[18px]">
              add
            </span>
            Nova Obra
          </Link>
        </div>

        {obras && obras.length > 0 ? (
          <div className="grid gap-stack-lg md:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <article
                key={obra.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-stack-md flex flex-col gap-stack-md shadow-sm"
              >
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{obra.nome}</h3>
                  {obra.cliente_nome && (
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                      <span aria-hidden className="material-symbols-outlined text-[18px]">
                        person
                      </span>
                      {obra.cliente_nome}
                    </p>
                  )}
                  {obra.endereco && (
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                      <span aria-hidden className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      {obra.endereco}
                    </p>
                  )}
                </div>
                <div className="pt-stack-sm border-t border-outline-variant">
                  <Link
                    href={`/obras/${obra.id}/despesas`}
                    className="font-label-bold text-label-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Abrir obra
                    <span aria-hidden className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma obra ainda.</p>
        )}
      </main>
    </>
  );
}
