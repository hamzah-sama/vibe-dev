import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  children: React.ReactNode;
  teks: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const Hint = ({ children, teks, side='bottom', align='start' }: Props) => {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="select-none pointer-events-none!" side={side} align={align} >
          <p>{teks}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
