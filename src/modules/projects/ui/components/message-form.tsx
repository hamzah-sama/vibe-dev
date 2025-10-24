import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import TextAreaAutoSize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "value is required" })
    .max(100, { message: "value is too long" }),
});
export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const querClient = useQueryClient();
  const createdMessage = useMutation(
    trpc.message.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        querClient.invalidateQueries(
          trpc.message.getMany.queryOptions({ projectId })
        );
      },
      onError: (e) => {
        toast.error(e.message);
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    createdMessage.mutateAsync({
      value: value.value,
      projectId,
    });
  };
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isPending = createdMessage.isPending;
  const buttonDisable = isPending || !form.formState.isValid;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative bg-sidebar rounded-xl p-4 pt-1",
          isFocused && "shadow-none",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextAreaAutoSize
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none outline-none w-full bg-transparent rounded-lg"
              placeholder="what would you like to build"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="bg-muted rounded border text-muted-foreground select-none pointer-events-none inline-flex gap-1 px-2 py-1">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            disabled={buttonDisable}
            className={cn(
              "size-8 rounded-full",
              buttonDisable && "bg-muted-foreground border"
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
