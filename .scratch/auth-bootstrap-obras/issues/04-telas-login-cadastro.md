# Telas de login e cadastro

Status: open
Blocked by: 03

## Escopo

- `/login`: email + senha, chama `supabase.auth.signInWithPassword`.
- `/cadastro`: email + senha, chama `supabase.auth.signUp`.
- Sem recuperação de senha nesta ticket (fora de escopo do effort).
- Testar: cadastro cria usuário em `auth.users`, login autentica, erro de credencial inválida aparece pro usuário.

## Comments
