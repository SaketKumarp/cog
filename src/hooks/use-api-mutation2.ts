import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type RequestType = Id<"boards">;
type values = {
  boardId: RequestType;
  orgId: string;
};

type Options = {
  onSucess?: (id: RequestType) => void;
  onError?: () => void;
};

export const useApiMutationV2 = () => {
  //   const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const mutation = useMutation(api.board.unfavorite);

  const mutate = useCallback(
    async (values: values, options?: Options) => {
      try {
        setLoading(true);
        const resposne = await mutation(values);

        setLoading(false);
        options?.onSucess?.(resposne._id);
      } catch (error) {
        console.log(error);
        options?.onError?.();
      }
    },
    [mutation]
  );

  return { mutate, loading };
};
