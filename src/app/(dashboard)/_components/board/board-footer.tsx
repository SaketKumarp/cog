import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface FooterProps {
  isfavorite: boolean;
  title: string;
  onClick: () => void;
  createdatLabel: string;
  disabled: boolean;
  authorLabel: string;
}

export const Footer = ({
  isfavorite,
  title,
  onClick,
  createdatLabel,
  disabled,
  authorLabel,
}: FooterProps) => {
  return (
    <div className="relative bg-white p-3 ">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 truncate group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground ">
        {authorLabel},{createdatLabel}
      </p>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-[11px] text-muted-foreground hover:text-blue-600  ",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn(
            "h-4 w-4 ",
            isfavorite && "fill-blue-600 text-blue-600"
          )}
        />
      </button>
    </div>
  );
};
