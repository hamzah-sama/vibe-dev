import { Prisma } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESPONSE",
        },
        include:{
            fragment: true
        }
      });

      await inngest.send({
        name: "run/code.agent",
        data: { value: input.value },
      });

      return createdMessage;
    }),

  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return messages;
  }),
});
