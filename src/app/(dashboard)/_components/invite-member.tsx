"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const Invitemembers = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-x-2  transition"
        >
          <Plus size={16} />
          Invite Members
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-transparent border-none p-0 max-w-[900px] flex justify-center items-center">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "flex justify-center w-full",
              card: "  shadow-lg rounded-xl w-full max-w-[850px] text-white",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              profileSectionTitle: "text-[#1abc9c]",
              profileSectionPrimaryButton:
                "bg-[#1abc9c] hover:bg-[#16a085] text-white transition",
              profileSectionSecondaryButton:
                "bg-transparent border  text-gray-300 transition",
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
