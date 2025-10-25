"use client";

import { useCreateBoard } from "@/hooks/useCreateBoard";
import { cn } from "@/lib/utils";

import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewBoardButtonPorps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonPorps) => {
  const { laoding: Pending, mutate } = useCreateBoard();

  const handleClick = () => {
    mutate(
      {
        title: "Untitled",
        orgId: orgId,
      },
      {
        onSucces: (id) => {
          toast.success("New Board Created", {
            action: {
              label: "undo",
              onClick: () => console.log(id),
            },
          });
        },
        onError: () => {
          toast.error("Failed to create the board!");
        },
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "col-span-1 aspect-100/127 bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center y-6 ",
        disabled ||
          (Pending && "opacity-75 hover:bg-blue-800 cursor-not-allowed")
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1 " />
      <p className="text-white text-sm font-light ">New Baord</p>
    </button>
  );
};
