"use client";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";
import { useCreateBoard } from "@/hooks/useCreateBoard";
import { toast } from "sonner";

export const EmptyBoard = () => {
  const { organization } = useOrganization();
  const { mutate, laoding: pending } = useCreateBoard();

  const handleClick = () => {
    if (!organization) return;
    mutate(
      { title: "hey", orgId: organization.id },
      {
        // we are getitng id form onSuccess we created in hook
        onSucces: (id) => {
          console.log(id);
          //TODO: redirect to id
          toast.success("board is created ", {
            action: {
              label: "undo",
              onClick: () => console.log(id),
            },
          });
        },
        onError: () => {
          toast.error("failed to create Board");
        },
      }
    );
  };

  if (pending) {
    <div>board is laoding</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Image alt="nodata" width={500} height={500} src={"/find.svg"} />
      <p className="mt-2 font-semibold text-2xl">No Boards at all! </p>
      <Button onClick={handleClick} size={"lg"} disabled={pending}>
        Create Board
      </Button>
    </div>
  );
};
