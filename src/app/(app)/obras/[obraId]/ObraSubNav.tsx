import Link from "next/link";
import { ObraMenu } from "./ObraMenu";

export function ObraSubNav({ obraId, obraNome }: { obraId: string; obraNome: string }) {
  return (
    <div className="bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-1 px-margin-mobile pt-2 text-on-surface-variant text-[12px]">
        <Link href="/obras" className="hover:text-primary hover:underline">
          Obras
        </Link>
        <span aria-hidden>/</span>
        <span className="text-on-surface truncate">{obraNome}</span>
      </div>
      <div className="px-margin-mobile py-2">
        <ObraMenu obraId={obraId} />
      </div>
    </div>
  );
}
