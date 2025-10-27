"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [fragment, setFragment] = useState<Fragment | null>(null);
  const [keyIframe, setKeyIframe] = useState<number>(0);
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20}>
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessageContainer
              projectId={projectId}
              fragment={fragment}
              setFragment={setFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={40}>
          {!!fragment && (
            <>
              <ProjectHeader
                url={fragment?.sandboxUrl}
                setKeyIframe={setKeyIframe}
              />
              <iframe
                key={keyIframe}
                sandbox="allow-same-origin allow-scripts allow-forms"
                src={fragment?.sandboxUrl}
                className="w-full h-full"
              />
            </>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
