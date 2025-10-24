"use client";

import Image from "next/image";
import { EmptyBoard } from "./empty-board";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BoardCard } from "./board/board-card";

interface BoardListProps {
  query: {
    search?: string;
    favorites?: boolean;
  };
  orgId: string;
}

export const BoardList = ({ query, orgId }: BoardListProps) => {
  const data = useQuery(api.boards.getBoards, { orgId });
  console.log(data);

  if (!data?.length && query.search) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image alt="query" width={500} height={500} src={"/empty.svg"} />
        <p className="mt-2 font-semibold text-2xl  ">no such queries !</p>
      </div>
    );
  }

  if (!data?.length && !query.favorites) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image alt="query" width={500} height={500} src={"/favorite.svg"} />
        <p className="mt-2 font-semibold text-2xl">No favorites here ! </p>
      </div>
    );
  }
  if (!data?.length) {
    return <EmptyBoard />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query?.favorites ? "favorite Boards" : "Normal Boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-col-5 lg:grid-col-4 2xl:grid-col-6 gap-5 mt-8 pb-10  ">
        {data.map((board) => (
          <BoardCard
            isfavorite={false}
            authorname={board.authorname}
            autorId={board.authorId}
            boardId={board._id}
            key={board._id}
            createAt={board._creationTime}
            imageUrl={board.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
