import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Hint } from "../hints";

export const OrgButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square flex  ">
          <Hint hint="create Organisation" align="end" side="top">
            <button className="bg-white/25 h-full w-full hover:bg-white/60 rounded-md flex items-center justify-center cursor-pointer transition">
              <Plus className="text-white" />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-transparent p-0 border-none max-w-[100px] ">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
