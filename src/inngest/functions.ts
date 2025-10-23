import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import { getSandbox, lastAssistantMessageContent } from "./libs";
import z from "zod";
import { PROMPT } from "@/prompts";

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "run/code.agent" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("-vibe-dev-test-7");
      return sandbox.sandboxId;
    });
    const codeAgent = createAgent({
      name: "summarizer",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdOut: "", stdErr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdOut += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stdErr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error}\nstdOut: ${buffers.stdOut}\nstdErr: ${buffers.stdErr}`
                );
                return `Command failed: ${error}\nstdOut: ${buffers.stdOut}\nstdErr: ${buffers.stdErr}`;
              }
            });
          },
        }),
        createTool({
          name: "updateOrCreateFile",
          description: "Create or update a file in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run("createOrUpdateFIle", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const updateFiles = network.state.data.files || {};
                for (const file of files) {
                  if (file.path.startsWith("/") || file.path.includes("..")) {
                    throw new Error("Invalid file path: " + file.path);
                  }
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                }
                return updateFiles;
              } catch (error) {
                console.error("Error: " + error);
              }
            });

            if (typeof newFiles === "object")
              return (network.state.data.files = newFiles);
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error: " + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastMessage = await lastAssistantMessageContent(result);

          if (lastMessage && network) {
            if (lastMessage.includes("<task_summary>")) {
              network.state.data.summary = lastMessage;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) return;

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
