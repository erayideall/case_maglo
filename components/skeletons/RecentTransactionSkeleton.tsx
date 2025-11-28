import { Skeleton, SkeletonText, SkeletonCircle } from "./Skeleton";

export function RecentTransactionSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40 rounded" />
        <SkeletonText className="w-20" />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 mb-4">
        <div className="col-span-5">
          <SkeletonText className="w-32" />
        </div>
        <div className="col-span-3">
          <SkeletonText className="w-16" />
        </div>
        <div className="col-span-2">
          <SkeletonText className="w-20" />
        </div>
        <div className="col-span-2">
          <SkeletonText className="w-16" />
        </div>
      </div>

      {/* Transaction Rows */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-50 last:border-0">
          <div className="col-span-5 flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonText className="w-32" />
              <SkeletonText className="w-20" />
            </div>
          </div>
          <div className="col-span-3 flex items-center">
            <SkeletonText className="w-24" />
          </div>
          <div className="col-span-2 flex items-center">
            <SkeletonText className="w-20" />
          </div>
          <div className="col-span-2 flex items-center">
            <SkeletonText className="w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
