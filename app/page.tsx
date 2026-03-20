"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface LogEntry {
  id: string;
  text: string;
  createdAt: number;
}

const STORAGE_KEY = "omnilog_entries";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Home() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    inputRef.current?.focus();
  }, []);

  // Persist whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function log() {
    const text = input.trim();
    if (!text) return;
    const entry: LogEntry = { id: crypto.randomUUID(), text, createdAt: Date.now() };
    setEntries((prev) => [entry, ...prev]);
    setInput("");
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    inputRef.current?.focus();
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") log();
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="w-full max-w-xl mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Omni<span className="text-indigo-400">Log</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">Stop organizing. Start capturing.</p>
      </div>

      {/* Input */}
      <div className="w-full max-w-xl">
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-150 ${
            flash
              ? "border-indigo-400 shadow-lg shadow-indigo-900/40"
              : "border-gray-700 focus-within:border-indigo-500 focus-within:shadow-md focus-within:shadow-indigo-900/30"
          } bg-gray-900`}
        >
          <span className="text-indigo-400 text-lg select-none">›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What's on your mind? Hit Enter to log."
            className="flex-1 bg-transparent text-base text-gray-100 placeholder-gray-600 outline-none"
          />
          {input.trim() && (
            <button
              onClick={log}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Log
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-700 text-right">
          {entries.length} {entries.length === 1 ? "entry" : "entries"} captured
        </p>
      </div>

      {/* Feed */}
      <div className="w-full max-w-xl mt-8 flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="text-center text-gray-700 text-sm mt-10">
            Your log is empty. Start capturing.
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group flex items-start justify-between gap-4 rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 hover:border-gray-700 transition-colors"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm text-gray-200 break-words leading-snug">{entry.text}</p>
              <span className="text-xs text-gray-600">{formatTime(entry.createdAt)}</span>
            </div>
            <button
              onClick={() => deleteEntry(entry.id)}
              aria-label="Delete entry"
              className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 transition-all text-lg leading-none mt-0.5 shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {entries.length > 0 && (
        <button
          onClick={() => {
            if (confirm("Clear all entries?")) setEntries([]);
          }}
          className="mt-8 text-xs text-gray-700 hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      )}
    </main>
  );
}
