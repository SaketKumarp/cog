"use client";

import { useCallback, useState } from "react";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface Transcript {
  _id: string;
  orgId: string;
  boardId: string;
  userId: string;
  transcript: string;
  embeddings: number[];
  score?: number;
  _creationTime: number;
}

interface RequestType {
  orgId: string;
  boardId: string;
  queryEmbedding: number[];
  topK?: number;
}

export const useFindRelevantTranscripts = () => {
  const convex = useConvex();
  const [results, setResults] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRelevant = useCallback(
    async (values: RequestType): Promise<Transcript[]> => {
      try {
        setLoading(true);

        const response = (await convex.query(
          api.audio.findRelevantTranscripts,
          values
        )) as Transcript[];

        setResults(response);
        return response;
      } catch (error: unknown) {
        console.error("Failed to fetch relevant transcripts:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [convex]
  );

  return { results, fetchRelevant, loading };
};
