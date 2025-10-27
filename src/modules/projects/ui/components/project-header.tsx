import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCcwIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  url: string;
  setKeyIframe: Dispatch<SetStateAction<number>>;
}

export const ProjectHeader = ({ url, setKeyIframe }: Props) => {
  const [copiedActive, setCopiedActive] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopiedActive(true);
    setTimeout(() => {
      setCopiedActive(false);
    }, 2000);
  };
  return (
    <div className="flex items-center w-screen gap-4 border-b p-2">
      <Hint teks="Refresh">
        <Button
          variant="outline"
          onClick={() => setKeyIframe((prev) => prev + 1)}
        >
          <RefreshCcwIcon />
        </Button>
      </Hint>
      <Hint teks={copiedActive ? "copied" : "copy url"}>
        <Button
          variant="secondary"
          className="w-full text-left truncate max-w-[57%]"
          disabled={copiedActive}
          onClick={handleCopy}
        >
          {url}
        </Button>
      </Hint>
      <Hint teks="open in new tab">
        <Button variant="outline" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
          <ExternalLink className="size-4" />
        </Button>
      </Hint>
    </div>
  );
};
