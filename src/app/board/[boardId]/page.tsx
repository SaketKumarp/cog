import React from "react";
import { Canvas } from "./_component/canvas";
import { Room } from "@/components/Room";

interface boardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function BoardPage({ params }: boardPageProps) {
  const { boardId } = React.use(params);
  return (
    <div className="h-full w-full">
      <Room roomId={boardId} fallback={<div>Loading...........</div>}>
        <Canvas />ß
      </Room>
    </div>
  );
}
