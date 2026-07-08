export default function DashboardLoading() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-gray-900">Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="card p-4 mt-6 h-72 w-full shimmer" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-4 w-64">
      <div className="h-3 w-20 rounded mb-3 shimmer" />
      <div className="h-7 w-28 rounded mb-3 shimmer" />
      <div className="h-3 w-16 rounded shimmer" />
    </div>
  );
}