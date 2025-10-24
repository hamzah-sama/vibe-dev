import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt cannot be empty" })
          .max(10000, { message: "Prompt is too long" }),
        projectId: z
          .string()
          .min(1, { message: "Project ID is required" })
          .max(100, { message: "Project ID is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESPONSE",
          projectId: input.projectId,
        },
      });

      await inngest.send({
        name: "run/code.agent",
        data: { value: input.value, projectId: input.projectId },
      });

      return createdMessage;
    }),

  getMany: baseProcedure
    .input(
      z.object({
        projectId: z
          .string()
          .min(1, { message: "project id is required" })
          .max(100, { message: "project id is too long" }),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          fragment: true,
        },
      });
      return messages;
    }),
});
