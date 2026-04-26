import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "outline";

export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const base = "inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      : "bg-slate-900 text-white shadow-sm hover:bg-slate-800";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
