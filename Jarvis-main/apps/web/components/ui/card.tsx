import type { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`border bg-white ${className}`}>{children}</div>;
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-4 pb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-base font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-4 pt-2 ${className}`}>{children}</div>;
}
