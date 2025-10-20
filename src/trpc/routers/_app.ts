import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod/v3";
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          text: input.text,
        },
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
