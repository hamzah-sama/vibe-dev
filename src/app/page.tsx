"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.message.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.message.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message created successfully");
      },
    })
  );
  const [value, setValue] = useState("");
  return (
    <div className="min-w-7xl p-4">
      <Input onChange={(e) => setValue(e.target.value)} value={value} />
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value })}
      >
        Created Message
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default Page;
