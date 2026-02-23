"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResultsScreen } from "@/components/screens/ResultsScreen";

function ResultsContent({ moduleId }: { moduleId: string }) {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") ?? "0", 10);

  return <ResultsScreen moduleId={moduleId} score={score} />;
}

export default function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-nunito text-slate-text">
          Loading...
        </div>
      }
    >
      <ResultsContent moduleId={params.id} />
    </Suspense>
  );
}
