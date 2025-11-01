"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns"; // for pretty timestamps
import Link from "next/link";
import { Overlay } from "./over-lay";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./board-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useApiMutationV2 } from "@/hooks/use-api-mutation2";

type responseType = Id<"boards">;
interface BoardCardProps {
  boardId: responseType;
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
  const { mutate: favorite, loading: PendingFavorite } = useApiMutation();
  const { mutate: unfavorite, loading: pendingUnfavorite } = useApiMutationV2();

  const { userId, orgId } = useAuth();
  const authorLabel = userId === authorId ? "You" : authorname;
  const createdatLabel = formatDistanceToNow(createAt, {
    addSuffix: true,
  });

  const toggleFavorite = () => {
    if (!orgId) return;

    if (isfavorite) {
      unfavorite(
        { boardId, orgId },
        {
          onError: () => {
            toast.error("failed to make as unfavorites ");
          },
        }
      );
    } else {
      favorite(
        { boardId, orgId },
        {
          onError: () => {
            toast.error("Error occurred while favoriting");
          },
        }
      );
    }
  };

  return (
    <Link href={`/board/${boardId}`}>
      <div className="group aspect-100/127 border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={"card"} className="object-fit" fill />
          <Overlay />
          <Actions boardId={{ id: boardId }} title={title} side="top">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          isfavorite={isfavorite}
          title={title}
          authorLabel={authorLabel}
          createdatLabel={createdatLabel}
          disabled={pendingUnfavorite || PendingFavorite}
          onClick={toggleFavorite}
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
