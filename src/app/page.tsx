"use client";

import { useState } from "react";
import ItineraryForm from "@/components/ItineraryForm";
import ItineraryResult from "@/components/ItineraryResult";
import WeatherBadge from "@/components/WeatherBadge";
import ReasoningTrail from "@/components/ReasoningTrail";

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [trail, setTrail] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-2xl border px-6 py-16 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/40 dark:from-black/70 dark:via-black/60 dark:to-black/40" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold">Plan your next adventure</h1>
          <p className="text-sm text-black dark:text-white/70">
            Get a personalized, day-wise itinerary based on your destination,
            dates, and interests.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.15),transparent_40%)]" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ItineraryForm
            destination={destination}
            onDestinationChange={setDestination}
            onSubmit={async (payload) => {
              setLoading(true);
              setResult(null);
              try {
                const res = await fetch("/api/itinerary", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                setResult(
                  data.plan || data.message || "No itinerary generated."
                );
              } catch {
                setResult("Failed to generate itinerary.");
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                setStreaming(true);
                setResult("");
                setTrail([]);
                try {
                  const res = await fetch(
                    `/api/itinerary?destination=${encodeURIComponent(
                      destination
                    )}`
                  );
                  const reader = res.body?.getReader();
                  const decoder = new TextDecoder();
                  if (!reader) return;
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    setResult((prev) => (prev ?? "") + decoder.decode(value));
                    // naive trail: push short hints as chunks arrive
                    const hint = decoder.decode(value).slice(0, 60).trim();
                    if (hint) setTrail((t) => [...t, `Refined: ${hint}...`]);
                  }
                } finally {
                  setStreaming(false);
                }
              }}
              className="rounded bg-black text-white dark:bg-white dark:text-black border border-black/10 dark:border-white/15 px-3 py-2 text-sm disabled:bg-black/60 disabled:text-white dark:disabled:bg-white/70 dark:disabled:text-black"
              disabled={streaming || !destination}
            >
              {streaming ? "Streaming…" : "Stream Itinerary"}
            </button>
          </div>
          <ItineraryResult result={result} />
        </div>
        <div className="space-y-6">
          <WeatherBadge destination={destination} />
          <ReasoningTrail steps={trail} />
          <div className="rounded-xl border p-4 bg-white text-black dark:bg-black dark:text-white">
            <div className="text-sm font-medium mb-2">Tips</div>
            <ul className="text-sm list-disc pl-5 space-y-2">
              <li>Use public transport passes to save on city travel.</li>
              <li>Book timed tickets for popular attractions in advance.</li>
              <li>Pack for weather swings; check the forecast above.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
