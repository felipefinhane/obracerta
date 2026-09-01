# Telas de login e cadastro

Status: done
Blocked by: 03

## Escopo

- `/login`: email + senha, chama `supabase.auth.signInWithPassword`.
- `/cadastro`: email + senha, chama `supabase.auth.signUp`.
- Sem recuperação de senha nesta ticket (fora de escopo do effort).
- Testar: cadastro cria usuário em `auth.users`, login autentica, erro de credencial inválida aparece pro usuário.

## Comments

- `/cadastro` e `/login` com Server Actions (`signUp`/`signInWithPassword`), sem client-side JS necessário — formulário puro com progressive enhancement do Next.js.
- Estilo inline mínimo, sem componente de design ainda (não é o foco desta ticket).
- **Testado via HTTP real** (`pnpm dev` + `curl`, simulando o POST de progressive enhancement do form — sem precisar de navegador): cadastro cria usuário e sessão (cookie setado, confirmei o JWT decodificado batendo com o email), login com a mesma conta funciona numa sessão nova, senha errada redireciona de volta com a mensagem de erro do Supabase. Confirmei também que a sessão do cadastro já passa pelo middleware (`GET /` retorna 200 direto, sem redirect).
