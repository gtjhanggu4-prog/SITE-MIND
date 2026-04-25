"use client";

import { useState } from "react";

export function ModeToggle() {
  const [mode, setMode] = useState<"internal" | "customer">("internal");
  return (
    <div className="inline-flex rounded border border-slate-700">
      <button className={`px-3 py-1 ${mode === "internal" ? "bg-slate-700" : ""}`} onClick={() => setMode("internal")}>내부</button>
      <button className={`px-3 py-1 ${mode === "customer" ? "bg-slate-700" : ""}`} onClick={() => setMode("customer")}>고객</button>
    </div>
  );
}
