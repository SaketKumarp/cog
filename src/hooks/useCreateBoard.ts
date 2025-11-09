import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type responseType = { _id: Id<"boards"> };
type requestType = {
  title: string;
  orgId: string;
};

type Options = {
  onSucces?: (boardId: responseType) => void;
  onError?: (error: string) => void;
};

export const useCreateBoard = () => {
  const [data, setdata] = useState<responseType>();
  const [laoding, setLoading] = useState<boolean | undefined>(undefined);

  const create = useMutation(api.board.create);
  const mutate = useCallback(
    async (values: requestType, Options?: Options) => {
      try {
        setLoading(true);
        const response = await create(values);
        if (!response) throw new Error("failed to fetch");
        setdata(response);

        setLoading(false);
        Options?.onSucces?.(response);
      } catch (error) {
        console.log(error);
        Options?.onError?.("an error occurred");
      }
    },
    [create]
  );
  return { data, laoding, mutate };
};

//laoding state,data
