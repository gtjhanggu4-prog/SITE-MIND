import { Input } from "@/components/ui/input";

export function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value || 0))} />;
}
