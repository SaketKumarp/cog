import { Loader } from "lucide-react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

export const Loading = () => {
  return (
    <main className="relative h-screen w-full bg-neutral-500 touch-none flex items-center justify-center">
      <div className="z-50 flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-white" />
      </div>

      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};
