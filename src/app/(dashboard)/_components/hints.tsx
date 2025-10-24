import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

interface HintProps {
  children: React.ReactNode;
  hint: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideoffset?: number;
  alignoffset?: number;
}

export const Hint = ({ children, hint, side, align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-white bg-black border-black"
          side={side}
          align={align}
        >
          <p>{hint}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
