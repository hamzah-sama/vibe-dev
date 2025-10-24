"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const [value, setValue] = useState("");
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-y-4">
        <Input onChange={(e) => setValue(e.target.value)} value={value}
        placeholder="Create prompts..." />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value })}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Page;
