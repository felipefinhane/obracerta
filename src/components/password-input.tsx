"use client";

import { useState } from "react";

/**
 * Campo de senha com botão de mostrar/ocultar — padrão visual do Stitch
 * (docs/stitch/stitch_obra_certa/login, cadastro).
 */
export function PasswordInput({
  id,
  name,
  autoComplete,
  minLength,
  invalid,
}: {
  id: string;
  name: string;
  autoComplete?: string;
  minLength?: number;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <span
        aria-hidden
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      >
        lock
      </span>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        className={`w-full h-touch-target-min pl-10 pr-10 border rounded font-body-md text-body-md text-on-surface outline-none transition-colors ${
          invalid
            ? "bg-error-container border-error focus:border-error focus:ring-1 focus:ring-error"
            : "bg-surface-container-lowest border-outline focus:border-primary focus:ring-1 focus:ring-primary"
        }`}
      />
      <button
        type="button"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
      >
        <span aria-hidden className="material-symbols-outlined">
          {visible ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}
