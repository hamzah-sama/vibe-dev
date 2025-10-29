"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { FragmentUi } from "../components/fragment-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code2Icon, CrownIcon, EyeIcon } from "lucide-react";
import { CodeView } from "./code-view";
import { FileExplorerView } from "./file-explorer-view";
import { useFileExplorer } from "../../hooks/use-file-explorer";
import { isRecordString } from "../../hooks/use-record-string";
import { buildFileTree, fileEksxtension } from "@/lib/file-node";
import Link from "next/link";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [fragment, setFragment] = useState<Fragment | null>(null);
  const [keyIframe, setKeyIframe] = useState<number>(0);

  const files = isRecordString(fragment?.file) ? fragment!.file : {};
  const tree = buildFileTree(files);
  const { setSelectedFile, selectedFile } = useFileExplorer(tree);

  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left panel */}
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

        {/* Right panel */}
        <ResizablePanel
          defaultSize={65}
          minSize={40}
          className="flex flex-col min-h-0"
        >
          {!!fragment ? (
            <Tabs
              defaultValue="preview"
              className="flex flex-col flex-1 min-h-0 "
            >
              {/* Header Tabs */}
              <TabsList className="flex items-center justify-between gap-2 rounded-none border-none bg-background m-1 w-full">
                <div className="flex items-center gap-2">
                  <TabsTrigger value="preview" asChild>
                    <Button variant="outline">
                      <EyeIcon className="size-4" />
                      Preview
                    </Button>
                  </TabsTrigger>
                  <TabsTrigger value="code" asChild>
                    <Button variant="outline">
                      <Code2Icon className="size-4" />
                      Code
                    </Button>
                  </TabsTrigger>
                </div>
                <div className="mr-4">
                  <TabsTrigger value="upgrade" asChild>
                    <Button
                      asChild
                      variant="outline"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      <Link href="/pricing">
                        <CrownIcon className="size-4" />
                        Upgrade
                      </Link>
                    </Button>
                  </TabsTrigger>
                </div>
              </TabsList>

              {/* Preview */}
              <TabsContent value="preview" className="flex-1 min-h-0">
                <FragmentUi
                  keyIframe={keyIframe}
                  setKeyIframe={setKeyIframe}
                  fragmentUrl={fragment.sandboxUrl}
                />
              </TabsContent>

              {/* Code */}
              <TabsContent value="code" className="flex-1 min-h-0">
                <div className="h-full border-t flex flex-col min-h-0">
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={30} minSize={30}>
                      <FileExplorerView
                        files={fragment.file as Record<string, string>}
                        onFileSelect={setSelectedFile}
                      />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel
                      defaultSize={70}
                      minSize={30}
                      className="flex flex-col min-h-0"
                    >
                      <CodeView
                        code={{
                          [selectedFile?.path || ""]:
                            selectedFile?.content || "",
                        }}
                        lang={fileEksxtension(selectedFile?.path || "")}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-muted-foreground">
                Select a fragment to view results
              </span>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
