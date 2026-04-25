import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
