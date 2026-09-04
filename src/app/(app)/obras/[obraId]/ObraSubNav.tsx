import Link from "next/link";

export function ObraSubNav({ obraId, obraNome }: { obraId: string; obraNome: string }) {
  const itens = [
    { href: `/obras/${obraId}/despesas`, label: "Despesas" },
    { href: `/obras/${obraId}/etapas`, label: "Etapas" },
    { href: `/obras/${obraId}/orcado-realizado`, label: "Orçado x Realizado" },
    { href: `/obras/${obraId}/diario`, label: "Diário" },
  ];

  return (
    <div className="bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-1 px-margin-mobile pt-2 text-on-surface-variant text-[12px]">
        <Link href="/obras" className="hover:text-primary hover:underline">
          Obras
        </Link>
        <span aria-hidden>/</span>
        <span className="text-on-surface truncate">{obraNome}</span>
      </div>
      <nav className="flex gap-stack-md px-margin-mobile overflow-x-auto">
        {itens.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary py-2 whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
