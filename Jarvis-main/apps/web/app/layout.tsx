import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <nav className="border-b border-slate-800 p-4 text-sm">
          <div className="mx-auto flex max-w-7xl gap-4">
            <Link href="/dashboard">대시보드</Link>
            <Link href="/projects/alpha">프로젝트</Link>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl p-6">{children}</main>
      </body>
    </html>
  );
}
