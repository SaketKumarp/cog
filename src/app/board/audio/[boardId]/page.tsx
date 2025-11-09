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

interface AudioPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function BoardAudioPage({ params }: AudioPageProps) {
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

      const transcript = `Hinduism (/ˈhɪnduˌɪzəm/)[1] is an umbrella term[2][3][a] for a range of Indian religious and spiritual traditions (sampradayas)[4][note 1] that are unified by adherence to the concept of dharma, a cosmic order maintained by its followers through rituals and righteous living,[5][b] as expounded in the Vedas.[c] The word Hindu is an exonym,[note 2] and while Hinduism has been called the oldest surviving religion in the world,[note 3] it has also been described by the modern term Sanātana Dharma (lit. 'eternal dharma').[note 4] Vaidika Dharma (lit. 'Vedic dharma')[6] and Arya Dharma are historical endonyms for Hinduism.[7]

Hinduism entails diverse systems of thought, marked by a range of shared concepts that discuss theology, mythology, and other topics in textual sources.[8] Hindu texts have been classified into Śruti (lit. 'heard') and Smṛti (lit. 'remembered'). The major Hindu scriptures are the Vedas, the Upanishads, the Puranas, the Mahabharata (including the Bhagavad Gita), the Ramayana, and the Agamas.[9][10] Prominent themes in Hindu beliefs include the karma (action, intent and consequences),[9][11] saṃsāra (the cycle of death and rebirth) and the four Puruṣārthas, proper goals or aims of human life, namely: dharma (ethics/duties), artha (prosperity/work), kama (desires/passions) and moksha (liberation/emancipation from passions and ultimately saṃsāra).[12][13][14] Hindu religious practices include devotion (bhakti), worship (puja), sacrificial rites (yajna), and meditation (dhyana) and Yoga.[15] Hinduism has no central doctrinal authority and many Hindus do not claim to belong to any denomination.[16] However, scholarly studies notify four major denominations: Shaivism, Vaishnavism, Shaktism and Smartism, .[17][18] The six Āstika schools of Hindu philosophy that recognise the authority of the Vedas are: Sankhya, Yoga, Nyaya, Vaisheshika, Mīmāṃsā, and Vedanta.[19][20]`;

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
