"use client";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const delay = 500;
  const debouncedValue = useDebounce(value, delay);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: { search: debouncedValue },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="relative w-full max-w-[512px]">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        className="w-full pl-10"
        onChange={handleChange}
        value={value}
        placeholder="Search boards"
      />
    </div>
  );
};
