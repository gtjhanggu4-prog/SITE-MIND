import { CategoryComparisonTable } from "@/components/CategoryComparisonTable";
import { ModeToggle } from "@/components/ModeToggle";
import { ReliabilityBadge } from "@/components/ReliabilityBadge";
import { UnsuitableCard } from "@/components/UnsuitableCard";

export default function CategoryComparisonPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">업종 추천 vs 위험 비교</h2>
      <div className="flex items-center gap-3"><ModeToggle /><ReliabilityBadge score={79.1} warning /></div>
      <CategoryComparisonTable />
      <UnsuitableCard />
    </div>
  );
}
