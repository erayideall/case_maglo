import { Skeleton, SkeletonText } from "./Skeleton";

export function WalletSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="w-6 h-6 rounded" />
      </div>

      {/* Card 1 */}
      <div className="relative mb-4">
        <Skeleton className="w-full h-[140px] rounded-2xl" />
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-start justify-between mb-8">
            <div>
              <SkeletonText className="w-24 mb-2 bg-white/30" />
              <Skeleton className="w-10 h-6 rounded bg-white/30" />
            </div>
            <Skeleton className="w-10 h-10 rounded bg-white/30" />
          </div>
          <SkeletonText className="w-48 bg-white/30" />
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative mb-4">
        <Skeleton className="w-full h-[140px] rounded-2xl" />
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-start justify-between mb-8">
            <div>
              <SkeletonText className="w-24 mb-2 bg-white/30" />
              <Skeleton className="w-10 h-6 rounded bg-white/30" />
            </div>
            <Skeleton className="w-10 h-10 rounded bg-white/30" />
          </div>
          <div className="space-y-1">
            <SkeletonText className="w-32 bg-white/30" />
            <SkeletonText className="w-20 bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
