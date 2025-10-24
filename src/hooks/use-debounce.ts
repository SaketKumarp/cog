import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [delayedValue, setDelayedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return delayedValue;
};
