"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

type requestType = { id: Id<"boards"> };

type options = {
  onSuccess: () => void;
  onError: () => void;
};
// hook to remove board
export const useDelete = () => {
  const [pending, setPending] = useState<boolean | undefined>(false);

  const remove = useMutation(api.board.deleteBoard);

  const mutate = useCallback(
    async (value: requestType, options?: options) => {
      try {
        setPending(true);
        await remove(value);
        setPending(false);
        options?.onSuccess();
      } catch (error) {
        console.log(error);
        options?.onError();
      }
    },
    [remove]
  );

  return { mutate, pending };
};
