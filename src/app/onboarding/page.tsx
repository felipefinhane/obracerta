import { criarConstrutora } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Crie sua construtora</h1>
      <p>Você vira admin dela automaticamente — dá pra criar obras e convidar gente depois.</p>
      {erro && <p style={{ color: "crimson" }}>{erro}</p>}
      <form action={criarConstrutora} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label>
          Nome da construtora
          <input name="nome" type="text" required style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          CNPJ (opcional)
          <input name="cnpj" type="text" style={{ display: "block", width: "100%" }} />
        </label>
        <button type="submit">Criar</button>
      </form>
    </main>
  );
}
