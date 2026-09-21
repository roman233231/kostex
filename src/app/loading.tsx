export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-full border-2 border-[var(--purple)] border-t-transparent mx-auto mb-4"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      </div>
    </div>
  );
}