"use client";

import { useCreateBoard } from "@/hooks/useCreateBoard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const { laoding: pending, mutate } = useCreateBoard();

  const handleClick = () => {
    mutate(
      {
        title: "Untitled",
        orgId: orgId,
      },
      {
        onSucces: (id) => {
          toast.success("New board created", {
            action: {
              label: "Undo",
              onClick: () => console.log(id),
            },
          });
        },
        onError: () => toast.error("Failed to create the board!"),
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || pending}
      className={cn(
        "w-240px h-[180px] rounded-md border border-gray-200 shadow-sm flex flex-col items-center justify-center transition-all duration-200 hover:shadow-md hover:-translate-y-2px",
        "bg-[#1abc9c] hover:bg-[#16a085] text-white",
        (disabled || pending) && "opacity-70 cursor-not-allowed"
      )}
    >
      <Plus className="h-10 w-10 stroke-[1.5]" />
      <p className="text-sm mt-2 font-medium">New Board</p>
    </button>
  );
};
