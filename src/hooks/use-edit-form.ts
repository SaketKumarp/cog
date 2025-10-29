"use client";

import { useCallback, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type editBoard = {
  title: string;
  id: Id<"boards">;
};

type Options = {
  onSuccess: () => void;
  onError: () => void;
};

export const useEditForm = () => {
  const [loading, setLoading] = useState(true);

  const mutation = useMutation(api.board.updateBoard);

  const mutate = useCallback(
    async (value: editBoard, options?: Options) => {
      try {
        setLoading(true);
        await mutation(value);

        setLoading(false);
        options?.onSuccess();
      } catch (error) {
        console.log(error);
        options?.onError();
      }
    },
    [mutation]
  );

  return { mutate, loading };
};
