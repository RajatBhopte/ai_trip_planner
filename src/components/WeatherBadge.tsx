"use client";

import { useEffect, useMemo, useState } from "react";

type Weather = {
  name?: string;
  main?: { temp?: number };
  weather?: { description?: string; icon?: string }[];
};

export default function WeatherBadge({
  destination,
}: {
  destination?: string;
}) {
  const [data, setData] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const query = useMemo(() => (destination || "").trim(), [destination]);

  useEffect(() => {
    let cancelled = false;
    if (!query || query.length < 3) {
      setData(null);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/weather?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
        }
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  if (!query) return null;

  return (
    <div className="rounded-xl border p-4 bg-white text-black dark:bg-black dark:text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm text-black/80 dark:text-white/60">
            Weather
          </div>
          <div className="text-base font-medium">{destination}</div>
        </div>
        <div className="text-right">
          {loading ? (
            <div className="text-sm opacity-70">Loading…</div>
          ) : data?.main?.temp != null ? (
            <div className="text-2xl font-semibold">
              {Math.round(data.main.temp)}°C
            </div>
          ) : (
            <div className="text-sm opacity-70">—</div>
          )}
          <div className="text-xs text-black/80 dark:text-white/60">
            {data?.weather?.[0]?.description ?? ""}
          </div>
        </div>
      </div>
    </div>
  );
}
