"use client";

import { useEffect, useState } from "react";

function getInitialTheme(): "light" | "dark" {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Read initial theme on mount to avoid SSR/client mismatch
  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    if (!theme) return;
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="rounded-full border px-3 py-1 text-sm hover:bg-black/[.05] dark:hover:bg-white/[.06]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌙 Dark" : theme === "light" ? "☀️ Light" : "Theme"}
    </button>
  );
}
