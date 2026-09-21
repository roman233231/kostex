export default function PortfolioLoading() {
  return (
    <div className="container py-16">
      <div className="mb-12">
        <div className="skeleton skeleton-line" style={{ width: '100px', height: '24px' }} />
        <div className="skeleton mt-6" style={{ height: '60px', maxWidth: '400px' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-image" />
            <div className="p-6">
              <div className="skeleton skeleton-line" style={{ width: '80px' }} />
              <div className="skeleton skeleton-title mt-3" />
              <div className="skeleton skeleton-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}