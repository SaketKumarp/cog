"use client";

import { Button } from "@/components/ui/button";
import { useCreateBoard } from "@/hooks/useCreateBoard";
import { useOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { toast } from "sonner";

export const CreateBoard = () => {
  const { organization } = useOrganization();
  const { mutate, laoding: pending } = useCreateBoard();

  const handleClick = () => {
    if (!organization) return;
    mutate(
      {
        title: "saket",
        orgId: organization?.id,
      },
      {
        onSucces: (id) => {
          //TODO: use route to navigate through the board

          toast.success("Board Created", {
            action: {
              label: "undo",
              onClick: () => console.log(id),
            },
          });
        },
        onError: () => {
          toast.error("Failed to create Board");
        },
      }
    );
  };

  return (
    <Button
      variant={"secondary"}
      size={"lg"}
      onClick={handleClick}
      disabled={pending}
    >
      <Plus />
      Create Baord
    </Button>
  );
};
