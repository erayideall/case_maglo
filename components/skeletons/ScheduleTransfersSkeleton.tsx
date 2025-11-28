import { Skeleton, SkeletonText, SkeletonCircle } from "./Skeleton";

export function ScheduleTransfersSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40 rounded" />
        <SkeletonText className="w-20" />
      </div>

      {/* Transfer Items */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 flex-1">
              <SkeletonCircle className="w-10 h-10 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonText className="w-32" />
                <SkeletonText className="w-24" />
              </div>
            </div>
            <div className="text-right">
              <SkeletonText className="w-20 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
