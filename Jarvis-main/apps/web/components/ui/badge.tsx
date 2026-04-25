import type { ReactNode } from "react";

export function Badge({ className = "", variant = "default", children }: { className?: string; variant?: "default" | "secondary" | "outline"; children: ReactNode }) {
  const map = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-800",
    outline: "border border-slate-300 text-slate-700",
  } as const;
  return <span className={`inline-flex items-center px-2 py-1 text-xs ${map[variant]} ${className}`}>{children}</span>;
}
