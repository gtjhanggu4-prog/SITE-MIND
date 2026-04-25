import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const variant = ["위험", "critical", "종료"].includes(status) ? "outline" : "secondary";
  return <Badge variant={variant} className="rounded-full">{status}</Badge>;
}
