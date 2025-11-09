"use client";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useDispatch } from "react-redux";
import { searchValue } from "@/reducers/render";

export const SearchInput = () => {
  const dispatch = useDispatch();
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

    dispatch(searchValue(debouncedValue)); // dispatched the value

    router.push(url);
  }, [debouncedValue, router, dispatch]);

  return (
    <div className="relative w-full max-w-lg">
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
