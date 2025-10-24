import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { Suspense } from "react";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20}>
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessageContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={40}>
          Project Result
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
