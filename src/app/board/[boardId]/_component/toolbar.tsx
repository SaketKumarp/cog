import { Skeleton } from "@/components/ui/skeleton";

export const Toolbar = () => {
  return (
    <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center gap-y-4">
      <div className="bg-white rounded-md p-2 shadow-md flex flex-col items-center gap-y-1">
        <div>Pencil</div>
        <div>Pencil</div>
        <div>Pencil</div>
        <div>Pencil</div>
        <div>Pencil</div>
      </div>
      <div className="shadow-md bg-white flex flex-col gap-y-1 p-2">
        <div>undo</div>
        <div>redo</div>
      </div>
    </div>
  );
};

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center gap-y-4 w-[50px] h-[360px] shadow-md">
      <Skeleton className="h-full w-full text-muted-400" />
    </div>
  );
};
