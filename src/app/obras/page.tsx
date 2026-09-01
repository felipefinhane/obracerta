import { createClient } from "@/lib/supabase/server";
import { criarObra } from "./actions";

export default async function ObrasPage() {
  const supabase = await createClient();

  // RLS já filtra pro que o usuário tem acesso (has_obra_access) — sem
  // lógica extra de autorização aqui.
  const { data: obras } = await supabase
    .from("obras")
    .select("id, nome, endereco, cliente_nome, valor_planejado_total")
    .order("criado_em", { ascending: false });

  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");

  return (
    <main style={{ maxWidth: 640, margin: "3rem auto", padding: "0 1rem" }}>
      <h1>Obras</h1>

      {obras && obras.length > 0 ? (
        <ul>
          {obras.map((obra) => (
            <li key={obra.id}>
              <strong>{obra.nome}</strong>
              {obra.cliente_nome ? ` — ${obra.cliente_nome}` : ""}
              {obra.endereco ? ` — ${obra.endereco}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma obra ainda.</p>
      )}

      <h2>Nova obra</h2>
      <form action={criarObra} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {construtoras && construtoras.length > 1 ? (
          <label>
            Construtora
            <select name="construtora_id" required style={{ display: "block", width: "100%" }}>
              {construtoras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <input type="hidden" name="construtora_id" value={construtoras?.[0]?.id ?? ""} />
        )}
        <label>
          Nome
          <input name="nome" type="text" required style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Endereço
          <input name="endereco" type="text" style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Cliente
          <input name="cliente_nome" type="text" style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Valor total planejado
          <input name="valor_planejado_total" type="number" step="0.01" style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Data de início prevista
          <input name="data_inicio_prevista" type="date" style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Data de fim prevista
          <input name="data_fim_prevista" type="date" style={{ display: "block", width: "100%" }} />
        </label>
        <button type="submit">Criar obra</button>
      </form>
    </main>
  );
}
