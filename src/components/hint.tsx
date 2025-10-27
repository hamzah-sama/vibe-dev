import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  children: React.ReactNode;
  teks: string;
}

export const Hint = ({ children, teks }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{teks}</p>
      </TooltipContent>
    </Tooltip>
  );
};
