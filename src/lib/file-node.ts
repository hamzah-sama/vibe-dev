export interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
}

export function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];

  Object.entries(files).forEach(([path, content]) => {
    const parts = path.split("/");

    let current = root;

    parts.forEach((part, i) => {
      let node = current.find((c) => c.name === part);

      if (!node) {
        const isFile = i === parts.length - 1;
        node = {
          name: part,
          type: isFile ? "file" : "folder",
          ...(isFile ? { content } : { children: [] }),
        };
        current.push(node);
      }

      if (node.type === "folder") {
        current = node.children!;
      }
    });
  });

  return root;
}

export function fileEksxtension(path: string) {
  return path.split(".").pop();
}
