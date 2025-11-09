"use client";

import Image from "next/image";
import { EmptyBoard } from "./empty-board";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BoardCard } from "./board/board-card";
import { NewBoardButton } from "./board/new-board-button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/render";

interface BoardListProps {
  query: {
    search?: string;
    favorites?: boolean;
  };
  orgId: string;
}

export const BoardList = ({ query, orgId }: BoardListProps) => {
  const value = useSelector((state: RootState) => state.render.search);

  const data = useQuery(api.boards.getBoards, { search: value, orgId });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">
          {query?.favorites ? "Favorite Boards" : "Boards"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          {[...Array(6)].map((_, i) => (
            <BoardCard.Skeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length && query.favorites) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image alt="query" width={400} height={400} src={"/favorite.svg"} />
        <p className="mt-3 font-semibold text-xl text-gray-700">
          No favorites here!
        </p>
      </div>
    );
  }

  if (!data?.length) {
    return <EmptyBoard />;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">
        {query?.favorites ? "Favorite Boards" : "Boards"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            isfavorite={board.isFavorite}
            authorname={board.authorname}
            authorId={board.authorId}
            boardId={board._id}
            createAt={board._creationTime}
            imageUrl={board.imageUrl}
            title={board.title}
          />
        ))}
      </div>
    </div>
  );
};
