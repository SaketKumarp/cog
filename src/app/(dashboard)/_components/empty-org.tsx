import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import Image from "next/image";

export const EmptyOrg = () => {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <Image alt="empty" src={"/collab.svg"} height={300} width={300} />

      <h2 className="font-bold text-2xl mt-6">Create Your Own Board!</h2>
      <p className="text-muted-foreground text-sm mt-2">Get Started!</p>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"lg"}>Create An Organization</Button>
          </DialogTrigger>
          <DialogTitle></DialogTitle>
          <DialogContent className="bg-transparent max-w-[480px] border-none p-0">
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
