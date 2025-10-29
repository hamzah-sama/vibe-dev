import { Dispatch, SetStateAction } from "react";
import { ProjectHeader } from "./project-header";

interface Props {
  fragmentUrl: string;
  setKeyIframe: Dispatch<SetStateAction<number>>;
  keyIframe: number;
}

export const FragmentUi = ({ fragmentUrl, setKeyIframe, keyIframe }: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ProjectHeader url={fragmentUrl} setKeyIframe={setKeyIframe} />
      <iframe
        key={keyIframe}
        sandbox="allow-same-origin allow-scripts allow-forms"
        src={fragmentUrl}
        className="w-full h-full"
      />
    </div>
  );
};
