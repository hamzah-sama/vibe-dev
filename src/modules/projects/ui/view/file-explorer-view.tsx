"use client";

import { FolderIcon, FolderOpenIcon, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildFileTree, FileNode } from "@/lib/file-node";
import { useFileExplorer } from "../../hooks/use-file-explorer";

interface Props {
  files: Record<string, string>;
  onFileSelect?: (file: { path: string; content: string }) => void;
}

export const FileExplorerView = ({ files, onFileSelect }: Props) => {
  const tree = buildFileTree(files);
  const { openFolders, toggleFolder, selectedFile, setSelectedFile } = useFileExplorer(tree);

  const renderNode = (node: FileNode, path = node.name) => {
    if (node.type === "folder") {
      const isOpen = openFolders.has(path);
      return (
        <div key={path} className="select-none">
          <div
            onClick={() => toggleFolder(path)}
            className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-accent rounded"
          >
            {isOpen ? (
              <FolderOpenIcon className="size-4 text-yellow-500" />
            ) : (
              <FolderIcon className="size-4 text-yellow-500" />
            )}
            <span className="font-medium">{node.name}</span>
          </div>

          {isOpen && (
            <div className="pl-4 border-l border-border ml-2">
              {node.children?.map((child) =>
                renderNode(child, `${path}/${child.name}`)
              )}
            </div>
          )}
        </div>
      );
    }

    // FILE node
    return (
      <div
        key={path}
        onClick={() => {
          const fileData = { path, content: node.content || "" };
          setSelectedFile(fileData);
          onFileSelect?.(fileData);
        }}
        className={cn(
          "flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-accent",
          selectedFile?.path === path && "bg-accent/60"
        )}
      >
        <FileIcon className="size-4 text-blue-500" />
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto text-sm font-mono p-2">
      {tree.map((node) => renderNode(node))}
    </div>
  );
};
