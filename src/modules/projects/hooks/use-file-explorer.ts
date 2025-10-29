import { FileNode } from "@/lib/file-node";
import { useState } from "react";

export function useFileExplorer(tree: FileNode[]) {
  const [openFolders, setOpenFolder] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
  } | null>(null);
  function toggleFolder(path: string) {
    setOpenFolder((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }
  return {
    openFolders,
    toggleFolder,
    selectedFile,
    setSelectedFile,
  };
}
