import { ProjectView } from "@/modules/projects/ui/view/projectView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ projectId })
  );

  void queryClient.prefetchQuery(
    trpc.message.getMany.queryOptions({ projectId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
