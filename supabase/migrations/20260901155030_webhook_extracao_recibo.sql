-- Database Webhook: dispara a Edge Function de extração quando
-- recibos.status_processamento vira 'pendente' (ADR 0002 revisado — não
-- mais no INSERT, porque o arquivo não existe no Storage ainda nesse ponto).
--
-- URL e anon key hardcoded pro projeto hospedado (vsowiqfswpmlwvlvkhyh) —
-- não é portável pra outro projeto Supabase, é configuração específica
-- deste. A anon key é segura de deixar aqui (é pública por natureza — só
-- prova pra Edge Function que a chamada é de um cliente Supabase válido; a
-- Edge Function usa a service_role_key própria, via secret, pra tudo que
-- precisa de privilégio).
--
-- Como Postgres local também tem saída de internet, isso dispara a Edge
-- Function HOSPEDADA mesmo em dev local contra `supabase start` — testar
-- schema localmente com um UPDATE pra 'pendente' chama a API real do
-- Gemini de verdade (sem custo real no tier gratuito, mas é bom saber).
--
-- supabase_functions.http_request (o helper que o dashboard usaria) não
-- está disponível nesse projeto sem habilitar Database Webhooks pela UI
-- primeiro — usamos pg_net direto, que é sempre disponível.

create extension if not exists pg_net;

create or replace function public.trigger_extracao_recibo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://vsowiqfswpmlwvlvkhyh.supabase.co/functions/v1/extrair-recibo',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzb3dpcWZzd3BtbHd2bHZraHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjU5MDcsImV4cCI6MjEwMzg0MTkwN30.986hcVmfXPx51Ltnw4RgseySPMvBNUifC8GaO-DS30Y'
    ),
    body := jsonb_build_object(
      'type', 'UPDATE',
      'table', 'recibos',
      'record', jsonb_build_object('id', new.id)
    )
  );
  return new;
end;
$$;

comment on function public.trigger_extracao_recibo() is
  'Chama a Edge Function extrair-recibo via pg_net quando status_processamento vira pendente. Ver ADR 0002 (revisado) e ticket 09.';

create trigger recibos_dispara_extracao
after update on public.recibos
for each row
when (new.status_processamento = 'pendente' and old.status_processamento is distinct from 'pendente')
execute function public.trigger_extracao_recibo();
