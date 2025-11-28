import { Skeleton, SkeletonText } from "./Skeleton";

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40 rounded" />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <SkeletonText className="w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <SkeletonText className="w-16" />
          </div>
          <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-[280px]">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2">
          {[...Array(5)].map((_, i) => (
            <SkeletonText key={i} className="w-8" />
          ))}
        </div>

        {/* Chart content */}
        <div className="ml-12 h-full flex items-end gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end gap-1">
              <div style={{ height: `${Math.random() * 60 + 40}%` }}>
                <Skeleton className="w-full rounded-t-lg h-full" />
              </div>
              <SkeletonText className="w-12 mx-auto mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
