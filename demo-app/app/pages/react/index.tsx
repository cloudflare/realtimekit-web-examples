import React, { useMemo } from "react";
import { useSearchParams, useOutletContext } from "react-router";
import FileTree, { type FileNode } from "../../components/editor/FileTree";
import Hero from "../../components/hero";
import { getFiles } from "../../utils/utils";

type Framework = "vanilla" | "react" | "angular";

interface OutletContext {
  selectedFramework: Framework;
  setSelectedFramework: (framework: Framework) => void;
}

const ReactExamples = () => {
  const [searchParams] = useSearchParams();
  const usecaseParam = searchParams.get("usecase") ?? "video";
  const mode = searchParams.get("mode") ?? "editor";
  const { selectedFramework, setSelectedFramework } = useOutletContext<OutletContext>();

  const files = useMemo(() => {
    return getFiles("react", usecaseParam, mode);
  }, [usecaseParam, mode]);

  return (
    <div className="w-full h-full">
      <Hero selectedFramework={selectedFramework} setSelectedFramework={setSelectedFramework}>
        {(selectedFile, setSelectedFile, expanded, setExpanded) => {
          const handleFileSelect = (file: FileNode | null | undefined) => {
            setSelectedFile(file ?? null);
          };
          return (
            <FileTree
              nodes={files}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile?.name || null}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          );
        }}
      </Hero>
    </div>
  );
};

export default ReactExamples;
