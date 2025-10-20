import { inngest } from "./client";
import { Agent, openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are an expert deveoper.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await summarizer.run(
      `answer the following text: ${event.data.text}`
    );

    return { output };
  }
);
