import { CapturarForm } from "./CapturarForm";

export default async function CapturarRecibioPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <header className="bg-surface border-b border-outline-variant flex items-center px-margin-mobile h-touch-target-min">
        <h1 className="font-headline-md text-headline-md text-primary">ObraCerta</h1>
      </header>

      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        <div className="w-full max-w-sm">
          <CapturarForm obraId={obraId} />
        </div>
      </main>
    </div>
  );
}
