import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Entrar</h1>
      {erro && <p style={{ color: "crimson" }}>{erro}</p>}
      <form action={login} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
            autoComplete="current-password"
            style={{ display: "block", width: "100%" }}
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
      <p>
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </main>
  );
}
