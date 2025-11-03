"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type RequestType = {
  transcript: string;
  embeddings: number[];
  boardId: string;
  orgId: string;
};

type Options = {
  onSuccess?: (response: string) => void;
  onError?: (error: unknown) => void;
};

export const useSaveTranscript = () => {
  const [loading, setLoading] = useState(false);
  const mutation = useMutation(api.audio.saveTranscript);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setLoading(true);
        const response = await mutation(values);

        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        console.error("Failed to save transcript:", error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutation]
  );

  return { mutate, loading };
};
