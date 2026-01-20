import { Skeleton } from "@/components/ui/skeleton";

export const Participants = () => {
  return (
    <div className="right-2 top-2 h-12 absolute bg-white rounded-md p-3 flex items-center shadow-md">
      participants
    </div>
  );
};

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div className="right-2 top-2 h-12 absolute bg-white rounded-md p-3 flex items-center shadow-md w-[100px]">
      <Skeleton className="w-full h-full text-muted-400" />
    </div>
  );
};
