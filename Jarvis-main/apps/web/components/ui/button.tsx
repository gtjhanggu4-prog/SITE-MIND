import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "outline";

export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const base = "inline-flex items-center px-3 py-2 text-sm font-medium";
  const styles = variant === "outline" ? "border border-slate-300 bg-white text-slate-900" : "bg-slate-900 text-white";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
