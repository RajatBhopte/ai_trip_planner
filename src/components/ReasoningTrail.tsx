"use client";

import { useEffect, useRef } from "react";

export default function ReasoningTrail({ steps }: { steps: string[] }) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [steps.length]);

  if (!steps.length) return null;

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/40 p-4 sm:p-5 shadow-sm">
      <div className="text-sm font-medium mb-3">How the plan is forming</div>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[10px] dark:bg-white dark:text-black">
              {i + 1}
            </span>
            <p className="text-sm text-black/80 dark:text-white/80">{s}</p>
          </li>
        ))}
      </ol>
      <div ref={endRef} />
    </div>
  );
}
