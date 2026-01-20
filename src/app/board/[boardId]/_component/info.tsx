import { Skeleton } from "@/components/ui/skeleton";

export const Info = () => {
  return (
    <div className="absolute top-2 left-2 p-2 rounded-md shadow-md bg-white h-12 flex center ">
      information about the board
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 p-2 rounded-md shadow-md bg-white h-12 flex center w-[300px] ">
      <Skeleton className="h-full w-full bg-muted-400" />
    </div>
  );
};
