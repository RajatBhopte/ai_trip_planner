export default function SuggestedTripsPage() {
  const trips = [
    {
      title: "Kyoto, Japan",
      location: "Japan",
      bestTime: "Mar–May, Oct–Nov",
      highlights: ["Temples", "Cherry Blossoms", "Tea Houses"],
    },
    {
      title: "Lisbon, Portugal",
      location: "Portugal",
      bestTime: "Mar–Jun, Sep–Oct",
      highlights: ["Pastel streets", "Trams", "Coastal views"],
    },
    {
      title: "Banff, Canada",
      location: "Alberta, Canada",
      bestTime: "Jun–Sep",
      highlights: ["Turquoise lakes", "Hiking", "Wildlife"],
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Suggested Trips</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((t) => (
          <div
            key={t.title}
            className="rounded-xl border p-4 space-y-2 transition-transform duration-200 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{t.title}</h2>
              <span className="text-xs text-black dark:text-white/60">
                {t.bestTime}
              </span>
            </div>
            <p className="text-sm text-black dark:text-white/70">
              {t.location}
            </p>
            <ul className="flex flex-wrap gap-2">
              {t.highlights.map((h) => (
                <li
                  key={h}
                  className="text-xs bg-black/[.05] dark:bg-white/[.06] rounded-full px-3 py-1"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
