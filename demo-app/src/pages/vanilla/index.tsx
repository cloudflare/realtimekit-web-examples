import { useSearchParams } from "react-router-dom";
import FileTree, { type FileNode } from "../../components/editor/FileTree";
import Hero from "../../components/hero";
import { useMemo } from "react";
import { getFiles } from "../../utils/utils";

const VanillaExamples = () => {
  const [searchParams] = useSearchParams();
  const usecaseParam = searchParams.get("usecase");
  const files = useMemo(() => {
    return getFiles("vanilla", usecaseParam);
  }, [usecaseParam]);
  return (
    <div className="w-full h-full">
      <Hero>
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

export default VanillaExamples;
