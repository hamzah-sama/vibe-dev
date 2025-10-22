import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./libs";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("-vibe-dev-test-7");
      return sandbox.sandboxId;
    });
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are an expert developer.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await summarizer.run(
      `answer the following text: ${event.data.text}`
    );

    const sandbox = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandbox };
  }
);
