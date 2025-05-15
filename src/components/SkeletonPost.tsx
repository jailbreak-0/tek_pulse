export default function SkeletonPost() {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
      {/* Avatar shimmer */}
      <div className="w-12 h-12 rounded-full shimmer dark:bg-gray-700 bg-gray-300" />

      {/* Post content shimmer */}
      <div className="flex-1 space-y-3">
        <div className="h-3 w-1/4 rounded shimmer dark:bg-gray-700 bg-gray-300" />
        <div className="h-4 w-3/4 rounded shimmer dark:bg-gray-700 bg-gray-300" />
        <div className="h-4 w-5/6 rounded shimmer dark:bg-gray-700 bg-gray-300" />
        <div className="h-4 w-2/3 rounded shimmer dark:bg-gray-700 bg-gray-300" />
      </div>
    </div>
  );
}
