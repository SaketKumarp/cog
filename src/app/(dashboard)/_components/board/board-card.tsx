"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns"; // for pretty timestamps
import Link from "next/link";
import { Overlay } from "./over-lay";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./board-footer";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardCardProps {
  boardId: string;
  title: string;
  authorname: string;
  authorId: string;
  imageUrl: string;
  createAt: number;
  isfavorite: boolean;
}

export const BoardCard = ({
  authorId,
  title,
  authorname,
  boardId,
  imageUrl,
  createAt,
  isfavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();
  const authorLabel = userId === authorId ? "You" : authorname;
  const createdatLabel = formatDistanceToNow(createAt, {
    addSuffix: true,
  });
  return (
    <Link href={`/board/${boardId}`}>
      <div className="group aspect-100/127 border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={"card"} className="object-fit" fill />
          <Overlay />
        </div>
        <Footer
          isfavorite={isfavorite}
          title={title}
          authorLabel={authorLabel}
          createdatLabel={createdatLabel}
          disabled={false}
          onClick={() => {}}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BaordCardSkeleton() {
  return (
    <div className="aspect-100/127 rounded-lg overflow-hidden">
      <Skeleton className="wfull h-full" />
    </div>
  );
};
