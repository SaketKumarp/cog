"use client";

import React, { useState } from "react"; // 👈 import React explicitly
import { AudioUploader } from "@/components/audio/audioDrag";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ai } from "@/func/use-gemini";
import { chunkTranscript, getEmbeddings } from "@/func/use-trans";
import { useFindRelevantTranscripts } from "@/hooks/use-get-transcript";
import { useSaveTranscript } from "@/hooks/use-save-trans";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function BoardPage({ params }: PageProps) {
  const { boardId } = React.use(params);

  const [output, setOutput] = useState<string | undefined>();
  const [query, setQuery] = useState<string>("");
  const [loadingGemini, setLoadingGemini] = useState(false);
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

      const transcript = `my name is saket haha`;

      const chunks = chunkTranscript(transcript, 10);
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
      console.log();

      toast.success("All chunks processed and saved!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to process transcript.");
    }
  };

  const handleFetchRelevant = async () => {
    try {
      if (!organization) return toast.error("No organization found!");
      if (!query.trim()) return toast.error("Enter a query first!");

      const queryEmbeddings = await getEmbeddings(query);

      await fetchRelevant({
        orgId: organization.id,
        boardId,
        queryEmbedding: queryEmbeddings,
        topK: 2,
      });

      results.map((result) =>
        console.log(
          result.boardId,
          result._creationTime,
          result.score,
          result.userId
        )
      );
      toast.success("Fetched relevant transcripts!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch relevant transcripts.");
    }
  };

  const handleGemini = async () => {
    try {
      if (!results || results.length === 0) {
        return toast.error("No relevant transcripts fetched yet!");
      }

      setLoadingGemini(true);

      const context = results.map((r) => r.transcript).join(" ");
      const prompt = `
        You are a helpful AI that analyzes and summarizes audio transcripts.
        Use the provided context as much as possible, but if the context doesn't have the answer,
        use your own general knowledge to respond helpfully.

        CONTEXT:
        ${context}

        QUESTION:
        ${query}
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
      toast.error("Error calling Gemini API");
    } finally {
      setLoadingGemini(false);
    }
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Board ID: <span className="text-[#1abc9c]">{boardId}</span>
      </h1>

      <AudioUploader boardId={boardId} />

      <div className="flex gap-4 my-4">
        <Button onClick={handleSaveTranscript} disabled={saving}>
          {saving ? "Saving..." : "Generate & Save Embeddings"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ask or Search Transcripts</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Ask something about your transcripts..."
            value={query}
            onChange={handleQuery}
          />
          <Button onClick={handleFetchRelevant} disabled={pendingFetch}>
            {pendingFetch ? "Fetching..." : "Find Relevant Context"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Context from Database</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 && (
            <p className="text-gray-500">No context fetched yet.</p>
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
          <CardTitle>Gemini Response</CardTitle>
        </CardHeader>
        <CardContent>
          {output ? (
            <p className="whitespace-pre-wrap">{output}</p>
          ) : (
            <p className="text-gray-500">
              {loadingGemini
                ? "Getting your answers ready........."
                : "Ask Gemini your query"}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGemini}
            variant="secondary"
            size="lg"
            className="cursor-pointer hover:bg-amber-50"
            disabled={loadingGemini}
          >
            Ask Gemini
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
