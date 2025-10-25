"use client";

import Image from "next/image";

import { useCreateBoard } from "@/hooks/useCreateBoard";

import { CreateBoard } from "./board/create-board";

export const EmptyBoard = () => {
  const { laoding: pending } = useCreateBoard();

  if (pending) {
    <div>board is laoding</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Image alt="nodata" width={500} height={500} src={"/find.svg"} />
      <p className="mt-2 font-semibold text-2xl">No Boards at all! </p>
      <CreateBoard />
    </div>
  );
};
