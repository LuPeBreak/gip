import { Skeleton } from "@/components/ui/skeleton";

export default function ProcessDetailsLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-4 w-[200px]" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[80px]" />
              </div>
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <Skeleton className="h-5 w-[150px] mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <Skeleton className="h-5 w-[100px] mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
