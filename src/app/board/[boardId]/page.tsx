import { AudioUploader } from "@/components/audio/audioDrag";

interface PageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardPage({ params }: PageProps) {
  const { boardId } = params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Board ID: <span className="text-[#1abc9c]">{boardId}</span>
      </h1>

      {/* Attach uploader for this board */}
      <AudioUploader boardId={boardId} />
    </div>
  );
}
