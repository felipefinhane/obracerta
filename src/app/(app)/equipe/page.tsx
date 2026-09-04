import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ConfirmDeleteForm } from "@/components/ConfirmDeleteForm";
import { atualizarPapelMembro, convidarMembro, removerMembro } from "./actions";

const PAPEL_LABEL: Record<string, string> = {
  admin: "Admin",
  engenheiro: "Engenheiro/Mestre de obra",
  financeiro: "Financeiro",
};

const STATUS_MENSAGEM: Record<string, string> = {
  adicionado: "Pessoa já tinha conta — acesso liberado na hora.",
  convite_pendente: "Convite registrado — o acesso é liberado automaticamente quando essa pessoa se cadastrar com esse e-mail.",
};

export default async function EquipePage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; status?: string }>;
}) {
  const { erro, status } = await searchParams;
  const supabase = await createClient();

  // membros_construtora_com_email já filtra via has_construtora_access no
  // próprio where da view (fundacao-tecnica não tinha esse padrão pra
  // auth.users — ver convite-equipe/01).
  const { data: membros } = await supabase
    .from("membros_construtora_com_email")
    .select("id, papel, email")
    .order("email");

  const { data: convitesPendentes } = await supabase
    .from("convites")
    .select("id, email, papel, criado_em")
    .is("obra_id", null)
    .is("aceito_em", null)
    .order("criado_em", { ascending: false });

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Equipe
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Quem tem acesso a todas as obras da construtora. Pra dar acesso restrito a uma obra só (cliente), use a
          aba Equipe dentro da obra.
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
          Membros
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
                  <form action={atualizarPapelMembro.bind(null, m.id)} className="flex items-center gap-1">
                    <select
                      name="papel"
                      defaultValue={m.papel}
                      className="h-touch-target-min px-2 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md text-[12px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="engenheiro">Engenheiro/Mestre de obra</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="font-label-bold text-label-bold text-primary text-[12px] px-2 py-1 hover:bg-surface-container rounded transition-colors"
                    >
                      Salvar
                    </button>
                  </form>
                  <ConfirmDeleteForm
                    action={removerMembro.bind(null, m.id)}
                    confirmMessage={`Remover ${m.email} da equipe?`}
                    label={`Remover ${m.email}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhum membro ainda.</p>
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
                <span className="text-on-surface-variant text-[12px] uppercase">
                  {PAPEL_LABEL[c.papel] ?? c.papel} — aguardando cadastro
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        action={convidarMembro}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
          Adicionar à equipe
        </h3>
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="pessoa@exemplo.com"
          required
          className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="papel">
          Papel
        </label>
        <select
          id="papel"
          name="papel"
          required
          className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="engenheiro">Engenheiro/Mestre de obra</option>
          <option value="financeiro">Financeiro</option>
          <option value="admin">Admin</option>
        </select>
        <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
          Acesso automático a todas as obras da construtora. Se a pessoa ainda não tem conta, o acesso é liberado
          assim que ela se cadastrar com esse e-mail.
        </p>
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Adicionar
        </button>
      </form>
    </main>
  );
}
