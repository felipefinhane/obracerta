import { CapturarForm } from "./CapturarForm";

export default async function CapturarRecibioPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;

  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
      <div className="w-full max-w-sm">
        <CapturarForm obraId={obraId} />
      </div>
    </main>
  );
}
