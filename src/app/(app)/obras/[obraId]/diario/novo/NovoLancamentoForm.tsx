"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { compressImage } from "@/lib/storage/compress-image";
import { criarEntradaDiario, criarMidiaDiario } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

type Etapa = { id: string; nome: string };

export function NovoLancamentoForm({ obraId, etapas }: { obraId: string; etapas: Etapa[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setErro(null);
    setEnviando(true);

    try {
      const formData = new FormData(formRef.current);
      const entrada = await criarEntradaDiario(obraId, formData);
      if ("error" in entrada) throw new Error(entrada.error);

      // Sem estado provisório aqui (ao contrário da captura de recibo) —
      // texto e fotos nascem juntos, então basta subir uma de cada vez.
      for (let i = 0; i < fotos.length; i++) {
        setProgresso(`Enviando foto ${i + 1} de ${fotos.length}…`);
        const comprimida = await compressImage(fotos[i]);
        const midia = await criarMidiaDiario(entrada.entradaId);
        if ("error" in midia) throw new Error(midia.error);

        const signRes = await fetch("/api/storage/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "diario_midia", id: midia.midiaId, action: "upload", contentType: "image/jpeg" }),
        });
        if (!signRes.ok) throw new Error("não consegui gerar a URL de upload");
        const { url } = (await signRes.json()) as { url: string };

        const uploadRes = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "image/jpeg" },
          body: comprimida,
        });
        if (!uploadRes.ok) throw new Error(`upload da foto ${i + 1} falhou`);
      }

      router.push(`/obras/${obraId}/diario`);
    } catch (e) {
      // O lançamento de texto já foi criado mesmo se uma foto falhar no
      // meio do caminho — não trava nem duplica o registro se reenviado.
      setErro(e instanceof Error ? e.message : "falha inesperada");
      setEnviando(false);
      setProgresso(null);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-stack-md bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
    >
      <div className="grid grid-cols-2 gap-stack-md">
        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="data">
            Data
          </label>
          <input
            id="data"
            name="data"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="clima">
            Clima do Dia
          </label>
          <select id="clima" name="clima" defaultValue="" className={inputClass}>
            <option value="">Selecione</option>
            <option value="ensolarado">Ensolarado</option>
            <option value="parcialmente_nublado">Parcialmente nublado</option>
            <option value="nublado">Nublado</option>
            <option value="chuvoso">Chuvoso</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <label className={labelClass} htmlFor="descricao">
          Atividades e Progresso
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={4}
          placeholder="Descreva o que foi feito hoje..."
          className={`${inputClass} h-auto py-2`}
        />
      </div>

      <div className="grid grid-cols-2 gap-stack-md">
        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="efetivo_presente">
            Efetivo (Pessoas)
          </label>
          <input
            id="efetivo_presente"
            name="efetivo_presente"
            type="number"
            min="0"
            step="1"
            placeholder="Ex: 12"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="etapa_id">
            Etapa Vinculada
          </label>
          <select id="etapa_id" name="etapa_id" defaultValue="" className={inputClass}>
            <option value="">Selecione uma etapa (opcional)</option>
            {etapas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <label className={labelClass} htmlFor="ocorrencias">
          Ocorrências
        </label>
        <input id="ocorrencias" name="ocorrencias" type="text" placeholder="Opcional" className={inputClass} />
      </div>

      <div className="flex flex-col gap-stack-sm">
        <label className={labelClass} htmlFor="fotos">
          Fotos
        </label>
        <input
          id="fotos"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFotos(Array.from(e.target.files ?? []))}
          className="font-body-md text-body-md text-on-surface-variant"
        />
        {fotos.length > 0 && (
          <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
            {fotos.length} {fotos.length === 1 ? "foto selecionada" : "fotos selecionadas"}
          </p>
        )}
      </div>

      {erro && (
        <div role="alert" className="bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r">
          <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
            error
          </span>
          <p className="font-body-md text-body-md text-on-error-container m-0">{erro}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm disabled:opacity-60"
      >
        {progresso ?? (enviando ? "Salvando…" : "Salvar Lançamento")}
      </button>
    </form>
  );
}
