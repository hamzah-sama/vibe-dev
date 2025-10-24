"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-cards";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";

interface Props {
  projectId: string;
}

export const MessageContainer = ({ projectId }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.message.getMany.queryOptions({ projectId })
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              type={message.type}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragement={false}
              onFragmentClick={() => {}}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      <div className="relative p-3  pt-1">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
