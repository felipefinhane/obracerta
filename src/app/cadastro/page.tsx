import Link from "next/link";
import { cadastrar } from "./actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Criar conta</h1>
      {erro && <p style={{ color: "crimson" }}>{erro}</p>}
      <form action={cadastrar} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Senha
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            style={{ display: "block", width: "100%" }}
          />
        </label>
        <button type="submit">Criar conta</button>
      </form>
      <p>
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </main>
  );
}
