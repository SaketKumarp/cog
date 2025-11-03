"use client";

import { AudioUploader } from "@/components/audio/audioDrag";
import { Button } from "@/components/ui/button";
import { getEmbeddings } from "@/hooks/use-trans";
import { toast } from "sonner";

interface PageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: PageProps) {
  const { boardId } = params;

  const handleClick = async () => {
    try {
      const a = await getEmbeddings("hello world");
      console.log(a);
      console.log(a.length);

      toast.success("ok", {
        action: {
          label: "embeddings",
          onClick: () => a.map((ind) => console.log(ind)),
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Board ID: <span className="text-[#1abc9c]">{boardId}</span>
      </h1>

      <AudioUploader boardId={boardId} />
      <Button onClick={handleClick}>Embeddings</Button>
    </div>
  );
}
