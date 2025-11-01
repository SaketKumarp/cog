"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { modalStatus } from "@/reducers/render";
import { RootState } from "@/store/render";
import { useEditForm } from "@/hooks/use-edit-form";

export const RenameModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.render.isOpen);
  const id = useSelector((state: RootState) => state.render.boardId);
  const { mutate, loading } = useEditForm();
  const [title, setTitle] = useState("");

  const onClose = () =>
    dispatch(modalStatus({ isOpen: false, boardId: undefined }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    // in case of undefined return error as in redux state initial value is undefined
    if (!id) {
      toast.error("Board ID missing — cannot edit");
      return;
    }

    mutate(
      { id, title },
      {
        onSuccess: () => {
          toast.success("Board title updated!", {
            action: {
              label: "Print",
              onClick: () => console.log(title),
            },
          });
          onClose();
        },
        onError: () => {
          toast.error("Failed to edit board");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board Title</DialogTitle>
          <DialogDescription>
            Enter the new title for this board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={60}
            placeholder="Enter new board title"
            disabled={loading}
          />

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" variant="default" disabled={loading}>
              Edit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
