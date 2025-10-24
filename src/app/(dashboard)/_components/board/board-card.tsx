"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns"; // for pretty timestamps
import Link from "next/link";
import { Overlay } from "./over-lay";

interface BoardCardProps {
  boardId: string;
  authorname: string;
  autorId: string;
  imageUrl: string;
  createAt: number;
  isfavorite: boolean;
}

export const BoardCard = ({
  authorname,
  boardId,
  imageUrl,
  createAt,
}: BoardCardProps) => {
  return (
    <Link href={`/board/${boardId}`}>
      <Card className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200  from-white/90 to-white/60 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
            {authorname}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative h-56 w-full">
          <Image
            alt="board image"
            src={imageUrl}
            fill
            className=" object-fill rounded-lg transition-transform duration-300 hover:scale-115"
          />
          <Overlay />
        </CardContent>

        <CardFooter className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <p>Created {formatDistanceToNow(new Date(createAt))} ago</p>
        </CardFooter>
      </Card>
    </Link>
  );
};
