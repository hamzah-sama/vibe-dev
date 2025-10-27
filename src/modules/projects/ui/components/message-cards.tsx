import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";

interface Props {
  content: string;
  role: MessageRole;
  type: MessageType;
  fragment?: Fragment | null;
  createdAt: Date;
  isActiveFragement: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

export const MessageCard = ({
  content,
  role,
  type,
  fragment,
  createdAt,
  isActiveFragement,
  onFragmentClick,
}: Props) => {
  if (role === "ASSISTANT") {
    return (
      <div
        className={cn(
          "flex flex-col group px-4 pb-2",
          type === "ERROR" && "text-red-500 dark:text-red-700"
        )}
      >
        <div className="flex items-center gap-2 mb-2 pl-2">
          <Image src="/logo.svg" alt="logo" height={18} width={18} />
          <span>vibe</span>
          <span
            className="text-xs text-muted-foreground font-medium opacity-0 transition-opacity group-hover:opacity-100
          "
          >
            {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
          </span>
        </div>
        <div className="flex flex-col gap-y-4 pl-8.5">
          <span>{content}</span>
          {fragment && type === "RESPONSE" && (
            <button
              className={cn(
                "flex text-start items-start gap-2 p-3 bg-muted hover:bg-secondary transition-colors w-fit rounded-lg",
                isActiveFragement &&
                  "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground"
              )}
              onClick={() => onFragmentClick(fragment)}
            >
              <Code2Icon className="size-4 mt-0.5" />
              <div className="flex flex-col flex-1">
                <span className="text-sm line-clamp-1 font-medium">{fragment.title}</span>
                <span className="text-sm">Preview</span>
              </div>
              <div className="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="size-4"/>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end pb-4  pr-2 pl-10 ">
        <Card className="bg-muted rounded-lg p-3 shadow-none border-none break-words max-w-[80%]">
          {content}
        </Card>
      </div>
    </div>
  );
};
