import { Skeleton } from "@nextui-org/skeleton";

export default function HeaderSkeleton() {
  return (
    <div className="relative">
      <div className="mt-12 w-full flex justify-center items-center flex-col">
        <Skeleton className="w-[50px] h-[50px] rounded" />
        <Skeleton className="h-6 w-32 mt-1 mb-2 rounded" />
      </div>

      <div className="absolute -top-8 right-2">
        <Skeleton />
      </div>
    </div>
  )
}
