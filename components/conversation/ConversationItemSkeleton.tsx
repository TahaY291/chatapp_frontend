const ConversationItemSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3">

    {/* Avatar */}
    <div className="relative shrink-0">
      <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
    </div>

    {/* Name + last message */}
    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
      <div className="flex justify-between items-center mb-0.5">
        <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
        <div className="h-3 w-8 rounded bg-muted animate-pulse shrink-0 ml-2" />
      </div>
      <div className="h-3 w-44 rounded bg-muted animate-pulse" />
    </div>

    {/* Right side — mimics unread badge slot */}
    <div className="shrink-0 w-5 flex justify-center">
      <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
    </div>

  </div>
)

export const ConversationSkeletonList = () => (
  <>
    {Array.from({ length: 7 }).map((_, i) => (
      <ConversationItemSkeleton key={i} />
    ))}
  </>
)