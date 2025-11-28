import { Skeleton, SkeletonText } from "./Skeleton";

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-100 min-h-[105px]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <SkeletonText className="w-24 mb-3" />
          <Skeleton className="h-8 w-32 rounded" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}
