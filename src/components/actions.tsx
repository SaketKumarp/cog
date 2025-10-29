"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useDelete } from "@/hooks/use-DeleteBoard";
import { Id } from "../../convex/_generated/dataModel";
import { ConfirmModal } from "@/app/(dashboard)/_components/board/on-confirm";
import { Button } from "./ui/button";
import { modalStatus } from "@/reducers/render";
import { useDispatch } from "react-redux";

type requestType = { id: Id<"boards"> };

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideoffset?: DropdownMenuContentProps["sideOffset"];
  boardId: requestType;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideoffset,
  boardId,
}: ActionProps) => {
  const dispatch = useDispatch();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${boardId}`)
      .then(() => toast.success("link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const { mutate, pending } = useDelete();
  const hanldeEdit = () => {
    dispatch(modalStatus({ isOpen: true, boardId: boardId.id }));
  };
  const handleDelete = () => {
    mutate(boardId, {
      onSuccess: () => {
        toast.success("board deleted !");
      },
      onError: () => {
        toast.error("failed to delete board");
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideoffset}
        onClick={(e) => e.stopPropagation()}
        className="w-60"
      >
        <DropdownMenuItem onClick={handleCopy}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Board Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-4 cursor-pointer" onClick={hanldeEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit This Board
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <ConfirmModal
          description="Are You Sure You Want To Delete The Board"
          title="Delete"
          disabled={pending}
          onConfirm={handleDelete}
        >
          <Button
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
            variant={"ghost"}
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
