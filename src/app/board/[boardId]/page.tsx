import React from "react";
import { Canvas } from "./_component/canvas";
import { Room } from "@/components/Room";
import { Loading } from "./_component/loading";

interface boardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function BoardPage({ params }: boardPageProps) {
  const { boardId } = React.use(params);

  return <Loading />;
  return (
    <div className="h-full w-full">
      <Room roomId={boardId} fallback={<Loading />}>
        <Canvas />
      </Room>
    </div>
  );
}
