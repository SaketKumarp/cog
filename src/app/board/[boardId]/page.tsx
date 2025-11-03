"use client";

import { AudioUploader } from "@/components/audio/audioDrag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chunkTranscript, getEmbeddings } from "@/func/use-trans";
import { useFindRelevantTranscripts } from "@/hooks/use-get-transcript";
import { useSaveTranscript } from "@/hooks/use-save-trans";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

interface PageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: PageProps) {
  const { boardId } = params;
  const { organization } = useOrganization();

  const { mutate, loading: saving } = useSaveTranscript();
  const {
    results,
    fetchRelevant,
    loading: pendingFetch,
  } = useFindRelevantTranscripts(); // useQuery-like hook

  const handleSaveTranscript = async () => {
    try {
      if (!organization) return toast.error("No organization found!");

      const transcript = `
The British brought cricket to India in the early 1700s, with the first cricket match played in 1721. 
It was played and adopted by Kolis of Gujarat... (rest of your text)
`;

      const chunks = chunkTranscript(transcript, 100);
      console.log("Chunks:", chunks);

      for (let i = 0; i < chunks.length; i++) {
        const textChunk = chunks[i];
        const embeddings = await getEmbeddings(textChunk);

        await mutate(
          {
            boardId,
            orgId: organization.id,
            transcript: textChunk,
            embeddings,
          },
          {
            onSuccess: (id) =>
              console.log(`✅ Saved chunk ${i + 1} with ID:`, id),
            onError: (err) => console.error(`❌ Error on chunk ${i + 1}:`, err),
          }
        );
      }

      toast.success("All chunks processed and saved!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to process transcript.");
    }
  };

  const handleFetchRelevant = async () => {
    try {
      if (!organization) return toast.error("No organization found!");

      const query = `who brought cricket in india?`;
      const queryEmbeddings = await getEmbeddings(query);

      await fetchRelevant({
        orgId: organization.id,
        boardId,
        queryEmbedding: queryEmbeddings,
        topK: 2,
      });

      toast.success("Fetched relevant transcripts!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch relevant transcripts.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Board ID: <span className="text-[#1abc9c]">{boardId}</span>
      </h1>

      <AudioUploader boardId={boardId} />

      <div className="flex gap-4 my-4">
        <Button onClick={handleSaveTranscript} disabled={saving}>
          {saving ? "Saving..." : "Generate & Save Embeddings"}
        </Button>

        <Button onClick={handleFetchRelevant} disabled={pendingFetch}>
          {pendingFetch ? "Fetching..." : "Find Relevant Transcripts"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Context passed to LLM</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 && (
            <p className="text-gray-500">No results yet.</p>
          )}
          {results.map((con) => (
            <p key={con._id} className="text-sm py-1">
              {con.transcript}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
