"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-cards";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { MessageHeader } from "./message-header";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
}

export const MessageContainer = ({ projectId }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.message.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 6000,
      }
    )
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);
  return (
    <div className="flex flex-col flex-1 h-full">
      <MessageHeader projectId={projectId} />
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
      <MessageLoading messages={messages} />
      <div className="relative p-3  pt-1">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
