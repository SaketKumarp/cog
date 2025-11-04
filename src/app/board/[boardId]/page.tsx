"use client";

import { useState } from "react";
import { AudioUploader } from "@/components/audio/audioDrag";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ai } from "@/func/use-gemini";
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
  const [output, setOutput] = useState<string | undefined>();
  const { boardId } = params;
  const { organization } = useOrganization();

  const { mutate, loading: saving } = useSaveTranscript();
  const {
    results,
    fetchRelevant,
    loading: pendingFetch,
  } = useFindRelevantTranscripts();

  const handleSaveTranscript = async () => {
    try {
      if (!organization) return toast.error("No organization found!");

      const transcript =
        "The history of Sanatan Dharma stretches from the ancient Vedic period, with its roots in the Vedas, to its evolution through different philosophies, the emergence of the Puranas, and the Bhakti movement.";

      const chunks = chunkTranscript(transcript, 20);
      console.log("Chunks:", chunks);

      for (let i = 0; i < chunks.length; i++) {
        const textChunk = chunks[i];
        const embeddings = await getEmbeddings(textChunk);
        console.log(embeddings);

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
  const query = `history of hinduism`;
  const handleFetchRelevant = async () => {
    try {
      if (!organization) return toast.error("No organization found!");

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

  const handleGemini = async () => {
    try {
      if (!results || results.length === 0) {
        return toast.error("no response from db!");
      }

      const context = results.map((r) => r.transcript).join("");
      const prompt = ` You are a helpful AI that analyzes and summarizes audio transcripts.
      Use the provided context to answer the user's question accurately.
      If the answer is not in the context, say "I don't have enough information
      
      CONTEXT : ${context}

      question : ${query}

      `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      console.log("Full response:", response);
      console.log("Model output:", response.text);
      setOutput(response.text);
    } catch (err) {
      console.error("Gemini API error:", err);
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
          <CardTitle>Context that will be passed to LLM</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>Ask Gemini Your Query</CardTitle>
        </CardHeader>
        <CardContent>
          {output}

          <CardFooter>
            <Button
              onClick={handleGemini}
              variant={"secondary"}
              size={"lg"}
              className="cursor-pointer hover:bg-amber-50"
            >
              Ask Gemini
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
