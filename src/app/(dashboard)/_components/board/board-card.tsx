"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useApiMutationV2 } from "@/hooks/use-api-mutation2";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Actions } from "@/components/actions";

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
  const { mutate: favorite } = useApiMutation();
  const { mutate: unfavorite } = useApiMutationV2();
  const { userId, orgId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorname;
  const createdatLabel = formatDistanceToNow(createAt, { addSuffix: true });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!orgId) return;

    if (isfavorite) {
      unfavorite(
        { boardId, orgId },
        { onError: () => toast.error("Failed to unfavorite board") }
      );
    } else {
      favorite(
        { boardId, orgId },
        { onError: () => toast.error("Error occurred while favoriting") }
      );
    }
  };

  return (
    <Link
      href={`/board/${boardId}`}
      className="rounded-md bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between w-240px h-[180px]"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start p-2">
        <div>
          <h3 className="font-semibold text-gray-800 hover:text-[#1abc9c] transition text-sm line-clamp-1">
            {title}
          </h3>
          <p className="text-[11px] text-gray-500">{createdatLabel}</p>
        </div>

        <button
          onClick={toggleFavorite}
          className="p-1 rounded-md hover:bg-gray-100 transition"
          title={isfavorite ? "Unfavorite" : "Favorite"}
        >
          <Star
            size={16}
            className={cn(
              "transition",
              isfavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
            )}
          />
        </button>
      </div>

      {/* Image Section */}
      <div className="relative w-full h-20 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl}
          alt="Board image"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-white/70 via-transparent" />
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between p-2 border-t bg-gray-50 relative">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-5 h-5 rounded-full bg-[#1abc9c] flex items-center justify-center text-white text-[10px] font-semibold">
            {authorLabel.charAt(0).toUpperCase()}
          </div>
          <span>{authorLabel}</span>
        </div>

        <Actions boardId={{ id: boardId }} title={title} side="top">
          <button
            className="p-1 rounded-md hover:bg-gray-100 transition z-10 relative"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <MoreHorizontal size={16} className="text-gray-500" />
          </button>
        </Actions>
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="rounded-md bg-white border border-gray-200 shadow-sm animate-pulse w-240px h-[180px]" />
  );
};
