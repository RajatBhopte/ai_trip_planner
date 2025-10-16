"use client";

import { useState } from "react";

type FormPayload = {
  destination: string;
  startDate?: string;
  endDate?: string;
  interests?: string;
  travelers?: number;
  budgetLevel?: "low" | "medium" | "high";
};

export default function ItineraryForm({
  onSubmit,
  loading,
  destination: controlledDestination,
  onDestinationChange,
}: {
  onSubmit: (payload: FormPayload) => Promise<void> | void;
  loading?: boolean;
  destination?: string;
  onDestinationChange?: (value: string) => void;
}) {
  const [destination, setDestination] = useState(controlledDestination ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [budgetLevel, setBudgetLevel] =
    useState<FormPayload["budgetLevel"]>("medium");

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/40 p-4 sm:p-6 shadow-sm">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            destination: controlledDestination ?? destination,
            startDate,
            endDate,
            interests,
            travelers,
            budgetLevel,
          });
        }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black dark:text-white">
            Destination
          </label>
          <input
            required
            value={controlledDestination ?? destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (onDestinationChange) onDestinationChange(e.target.value);
            }}
            placeholder="e.g. Kyoto, Japan"
            className="rounded-lg border border-black/15 dark:border-white/15 px-3 py-2 bg-white dark:bg-black/60 placeholder-black/40 dark:placeholder-white/40 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black dark:text-white">
            Interests
          </label>
          <input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="food, culture, hiking"
            className="rounded-lg border border-black/15 dark:border-white/15 px-3 py-2 bg-white dark:bg-black/60 placeholder-black/40 dark:placeholder-white/40 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black dark:text-white">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="peer rounded-lg border border-black/15 dark:border-white/15 pl-10 pr-3 py-2 bg-white dark:bg-black/60 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
              📅
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black dark:text-white">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="peer rounded-lg border border-black/15 dark:border-white/15 pl-10 pr-3 py-2 bg-white dark:bg-black/60 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
              📅
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black dark:text-white">
            Travelers
          </label>
          <input
            type="number"
            min={1}
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value || "1", 10))}
            className="rounded-lg border border-black/15 dark:border-white/15 px-3 py-2 bg-white dark:bg-black/60 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black dark:text-white">
            Budget
          </label>
          <select
            value={budgetLevel}
            onChange={(e) =>
              setBudgetLevel(e.target.value as FormPayload["budgetLevel"])
            }
            className="rounded-lg border border-black/15 dark:border-white/15 px-3 py-2 bg-white dark:bg-black/60 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded bg-black text-white dark:bg-white dark:text-black border border-black/10 dark:border-white/15 px-4 py-2 text-sm disabled:bg-black/60 disabled:text-white dark:disabled:bg-white/70 dark:disabled:text-black"
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>
      </form>
    </div>
  );
}
