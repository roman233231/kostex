export default function Loading() {
  return (
    <div className="container py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-white/5 rounded"></div>
        <div className="h-4 w-1/2 bg-white/5 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="h-40 bg-white/5 rounded-lg"></div>
          <div className="h-40 bg-white/5 rounded-lg"></div>
          <div className="h-40 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}