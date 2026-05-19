export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-3.5 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-5/6 rounded-lg" />
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton h-6 w-14 rounded-lg" />
          <div className="skeleton h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
