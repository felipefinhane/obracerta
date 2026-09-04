import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ConfirmDeleteForm } from "@/components/ConfirmDeleteForm";
import { convidarClienteObra, removerClienteObra } from "./actions";

const STATUS_MENSAGEM: Record<string, string> = {
  adicionado: "Pessoa já tinha conta — acesso liberado na hora.",
  convite_pendente: "Convite registrado — o acesso é liberado automaticamente quando essa pessoa se cadastrar com esse e-mail.",
};

export default async function EquipeObraPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string; status?: string }>;
}) {
  const { obraId } = await params;
  const { erro, status } = await searchParams;
  const supabase = await createClient();

  // membros_obra_com_email já filtra via has_obra_access no where da view
  // (convite-equipe/01) — sem lógica extra de autorização aqui.
  const { data: membros } = await supabase
    .from("membros_obra_com_email")
    .select("id, papel, email")
    .eq("obra_id", obraId)
    .order("email");

  const { data: convitesPendentes } = await supabase
    .from("convites")
    .select("id, email, criado_em")
    .eq("obra_id", obraId)
    .is("aceito_em", null)
    .order("criado_em", { ascending: false });

  const convidarNestaObra = convidarClienteObra.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Equipe da obra
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Acesso restrito a esta obra só (papel cliente — leitura). Pra dar acesso à construtora inteira, use a
          tela de Equipe no menu principal.
        </p>
      </div>

      {erro && <ErrorBanner mensagem={erro} />}
      {status && STATUS_MENSAGEM[status] && (
        <div role="status" className="bg-secondary-container border-l-4 border-primary p-3 flex items-start gap-3 rounded-r">
          <span aria-hidden className="material-symbols-outlined text-primary mt-0.5">
            check_circle
          </span>
          <p className="font-body-md text-body-md text-on-secondary m-0">{STATUS_MENSAGEM[status]}</p>
        </div>
      )}

      <div className="flex flex-col gap-stack-sm">
        <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
          Clientes com acesso
        </h3>
        {membros && membros.length > 0 ? (
          <ul className="flex flex-col gap-stack-sm">
            {membros.map((m) => (
              <li
                key={m.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md gap-stack-sm"
              >
                <span className="text-on-surface truncate">{m.email}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-on-surface-variant text-[12px] uppercase">{m.papel}</span>
                  <ConfirmDeleteForm
                    action={removerClienteObra.bind(null, obraId, m.id)}
                    confirmMessage={`Remover o acesso de ${m.email} a esta obra?`}
                    label={`Remover ${m.email}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhum cliente com acesso ainda.</p>
        )}
      </div>

      {convitesPendentes && convitesPendentes.length > 0 && (
        <div className="flex flex-col gap-stack-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
            Convites pendentes
          </h3>
          <ul className="flex flex-col gap-stack-sm">
            {convitesPendentes.map((c) => (
              <li
                key={c.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md"
              >
                <span className="text-on-surface">{c.email}</span>
                <span className="text-on-surface-variant text-[12px] uppercase">Aguardando cadastro</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        action={convidarNestaObra}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
          Convidar cliente
        </h3>
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="cliente@exemplo.com"
          required
          className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Convidar
        </button>
      </form>
    </main>
  );
}
