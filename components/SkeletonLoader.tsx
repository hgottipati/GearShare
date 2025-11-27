export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow animate-pulse overflow-hidden">
      <div className="aspect-video bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="h-3 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </div>
  )
}

