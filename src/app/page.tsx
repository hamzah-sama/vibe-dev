"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const test = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("succesfully hit the inngest");
      },
    })
  );
  const [value, setValue] = useState("");
  return (
    <div className="min-w-7xl p-4">
      <Input onChange={(e) => setValue(e.target.value)} value={value} />
      <Button onClick={() => test.mutate({ text: value })}>
        Invoke from background job
      </Button>
    </div>
  );
};

export default Page;
