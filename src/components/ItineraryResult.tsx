function toCards(text: string): { title: string; items: string[] }[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const cards: { title: string; items: string[] }[] = [];
  let current: { title: string; items: string[] } | null = null;
  for (const line of lines) {
    const dayMatch = line.match(/^Day\s*(\d+)/i);
    if (dayMatch) {
      if (current) cards.push(current);
      current = { title: `Day ${dayMatch[1]}`, items: [] };
      continue;
    }
    if (line.startsWith("- ")) {
      current?.items.push(line.replace(/^-\s*/, ""));
      continue;
    }
    // Ignore other lines; keep concise
  }
  if (current) cards.push(current);
  if (cards.length === 0) {
    return [{ title: "Itinerary", items: [text] }];
  }
  return cards;
}

export default function ItineraryResult({ result }: { result: string | null }) {
  if (!result) return null;
  const cards = toCards(result);
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {cards.map((c, cardIdx) => (
        <div
          key={c.title}
          className="group rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/40 p-4 sm:p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/90 text-white text-xs dark:bg-white dark:text-black">
                {cardIdx + 1}
              </span>
              <div className="text-sm font-semibold">{c.title}</div>
            </div>
          </div>
          <div className="space-y-2">
            {c.items.map((raw, idx) => {
              const match = raw.match(
                /^(Morning|Afternoon|Evening)\:\s*(.*)$/i
              );
              const label = match ? match[1] : null;
              const text = match ? match[2] : raw;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/[.02] dark:bg-white/[.04] p-3"
                >
                  <span className="mt-0.5 text-lg">
                    {label
                      ? label.toLowerCase() === "morning"
                        ? "🌅"
                        : label.toLowerCase() === "afternoon"
                        ? "🌤️"
                        : "🌙"
                      : "•"}
                  </span>
                  <div className="min-w-0">
                    {label && (
                      <span className="mr-2 inline-flex items-center rounded-full bg-black/80 text-white dark:bg-white dark:text-black px-2 py-0.5 text-[10px] uppercase tracking-wide">
                        {label}
                      </span>
                    )}
                    <span className="text-sm text-black dark:text-white/85">
                      {text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
