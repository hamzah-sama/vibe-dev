import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(z.object({ value: z.string() }))
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "run/code.agent",
        data: {
          value: input.value,
        },
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
