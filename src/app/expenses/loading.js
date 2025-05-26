export default function Loading() {
  return (
    <div className="w-full max-w-lg md:max-w-2xl mx-auto min-h-screen bg-white p-3 sm:p-6 pt-8 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-20" />
      </div>

      {/* Header Skeleton */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-32" />
        <div className="w-10 h-10 rounded-full bg-gray-300" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center mb-6 gap-5">
        <div className="flex-1 h-9 bg-gray-300 rounded-md" />
        <div className="flex-1 h-9 bg-gray-300 rounded-md" />
      </div>

      {/* Category Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 p-5 rounded-2xl shadow flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1 flex flex-row items-center gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="w-32 h-5 bg-gray-300 rounded" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-center">
              <div className="w-20 h-8 bg-gray-300 rounded-lg" />
              <div className="w-20 h-8 bg-gray-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
