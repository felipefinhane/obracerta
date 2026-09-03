"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { compressImage } from "@/lib/storage/compress-image";
import { confirmarUploadRecibo, criarLancamentoProvisorio } from "./actions";

type Etapa = "ocioso" | "comprimindo" | "enviando" | "erro";

/**
 * Único input obrigatório no momento da captura é a foto — sem categoria,
 * etapa, fornecedor ou valor aqui (docs/planejamento.md §3 passo 1). Tudo
 * isso é preenchido depois, na confirmação (ticket 05).
 */
export function CapturarForm({ obraId }: { obraId: string }) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<Etapa>("ocioso");
  const [erro, setErro] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErro(null);
    try {
      setEtapa("comprimindo");
      const comprimida = await compressImage(file);

      setEtapa("enviando");
      const lancamento = await criarLancamentoProvisorio(obraId);
      if ("error" in lancamento) throw new Error(lancamento.error);
      const { reciboId } = lancamento;

      const signRes = await fetch("/api/storage/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "recibo", id: reciboId, action: "upload", contentType: "image/jpeg" }),
      });
      if (!signRes.ok) throw new Error("não consegui gerar a URL de upload");
      const { url } = (await signRes.json()) as { url: string };

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: comprimida,
      });
      if (!uploadRes.ok) throw new Error("upload pro storage falhou");

      const confirmado = await confirmarUploadRecibo(reciboId);
      if ("error" in confirmado) throw new Error(confirmado.error);

      router.push(`/obras/${obraId}/despesas/pendentes`);
    } catch (e) {
      // O lançamento já existe (criado antes do upload — ADR 0002), então o
      // gasto não se perde: fica em `aguardando_upload`, disponível pra
      // retry manual (ticket 04) mesmo se essa tentativa falhar aqui.
      setErro(e instanceof Error ? e.message : "falha inesperada");
      setEtapa("erro");
    }
  }

  return (
    <div className="flex flex-col items-center gap-stack-lg text-center">
      <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center">
        <span aria-hidden className="material-symbols-outlined text-on-primary-container text-5xl">
          photo_camera
        </span>
      </div>

      <div>
        <p className="font-headline-md text-headline-md text-on-surface">Fotografar recibo</p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Tire a foto e siga em frente — os detalhes você preenche depois, com calma.
        </p>
      </div>

      <label className="w-full max-w-xs h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
        <span aria-hidden className="material-symbols-outlined">
          camera_alt
        </span>
        {etapa === "comprimindo" && "Preparando foto…"}
        {etapa === "enviando" && "Enviando…"}
        {(etapa === "ocioso" || etapa === "erro") && "Tirar ou escolher foto"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={etapa === "comprimindo" || etapa === "enviando"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {erro && (
        <div role="alert" className="w-full bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r text-left">
          <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
            error
          </span>
          <p className="font-body-md text-body-md text-on-error-container m-0">
            Não deu pra enviar agora ({erro}). O gasto já ficou registrado — não se perdeu — mas o reenvio
            automático desse registro ainda não existe nesta versão; avise quem cuida do sistema.
          </p>
        </div>
      )}
    </div>
  );
}
