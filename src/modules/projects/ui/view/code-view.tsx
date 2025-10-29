"use client";

import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "@/lib/prism-theme.css";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
  code: Record<string, string>;
  lang?: string;
  onNavigatePath?: (partialPath: string) => void;
}

export const CodeView = ({ code, lang = "ts", onNavigatePath }: Props) => {
  const selectedFile = Object.keys(code)[0];
  const [copiedActive, setCopiedActive] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code[selectedFile]);
    setCopiedActive(true);
    setTimeout(() => setCopiedActive(false), 2000);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [code, lang]);

  const parts = selectedFile ? selectedFile.split("/") : [];

  return (
    <div className="flex flex-col flex-1 overflow-auto text-sm bg-transparent min-h-0 p-2">
      {code[selectedFile] && (
        <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              {parts.map((part, i) => {
                const fullPath = parts.slice(0, i + 1).join("/");
                const isLast = i === parts.length - 1;

                return (
                  <div key={fullPath} className="flex items-center">
                    <BreadcrumbItem>
                      {!isLast ? (
                        <BreadcrumbLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigatePath?.(fullPath);
                          }}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {part}
                        </BreadcrumbLink>
                      ) : (
                        <span className="font-medium text-foreground">
                          {part}
                        </span>
                      )}
                    </BreadcrumbItem>

                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <Hint teks="Copy snippet" align="end">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={copiedActive}
            >
              {copiedActive ? (
                <CopyCheckIcon className="size-4 text-green-500" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </Hint>
        </div>
      )}

      <pre className="flex-1 overflow-auto">
        {code[selectedFile] ? (
          <code className={`language-${lang}`}>{code[selectedFile]}</code>
        ) : (
          <div className="flex justify-center items-center h-full">
            Please select the file to see the code
          </div>
        )}
      </pre>
    </div>
  );
};
