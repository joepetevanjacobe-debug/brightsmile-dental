interface Props { rows?: number; className?: string }

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-card shadow-card p-6 ${className}`}>
      <div className="skeleton h-4 w-1/3 mb-3" />
      <div className="skeleton h-8 w-1/2 mb-2" />
      <div className="skeleton h-3 w-1/4" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: Props) {
  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="skeleton h-5 w-40" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-0">
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonText({ rows = 3 }: Props) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`skeleton h-4 ${i === rows - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}
