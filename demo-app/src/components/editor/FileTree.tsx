import { Icon } from "../icons";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  preset?: string;
  usecase?: "video" | "audio" | "livestream" | "webinar";
  children?: FileNode[];
  content?: string;
}

const FileTree = ({
  nodes,
  expanded,
  setExpanded,
  onFileSelect,
  selectedFile,
  level = 0,
}: {
  expanded: FileNode | null | undefined;
  setExpanded: React.Dispatch<
    React.SetStateAction<FileNode | null | undefined>
  >;
  nodes: FileNode[];
  onFileSelect: (file: FileNode | null | undefined) => void;
  selectedFile: string | null | undefined;
  level?: number;
}) => {
  const toggleFolder = (folder: FileNode, firstChild: FileNode | undefined) => {
    setExpanded((prev) => {
      if (prev?.name === folder.name) {
        onFileSelect(null);
        return null;
      }
      onFileSelect(firstChild);
      return folder;
    });
  };

  return (
    <div>
      {nodes.map((node, index) => (
        <div key={node.name}>
          <div
            className={`flex items-center gap-2 px-6 py-1 cursor-pointer hover:bg-orange-900/20 light:hover:bg-gray-200 ${
              selectedFile === node.name
                ? "bg-orange-700/10 light:bg-blue-100"
                : ""
            } ${
              node.type === "folder" || index === nodes.length - 1
                ? "border-b border-orange-200/20 light:border-amber-600/20 "
                : "border-b border-orange-200/5 light:border-amber-600/10"
            } ${
              expanded?.name === node.name
                ? "bg-orange-700/20 light:bg-blue-200"
                : ""
            }`}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
            onClick={() => {
              if (node.type === "folder") {
                toggleFolder(node, node?.children?.[0]);
              } else {
                onFileSelect(node);
              }
            }}
          >
            <span className="text-orange-100 light:text-gray-600 text-sm">
              {node.type === "folder" ? (
                expanded?.name === node.name ? (
                  <Icon name="folder" />
                ) : (
                  <Icon name="folder" />
                )
              ) : (
                <Icon name="docs" />
              )}
            </span>
            <span
              className={` text-sm ${
                node.type === "folder"
                  ? "font-bold text-orange-100 light:text-gray-700"
                  : "text-neutral-400 light:text-neutral-500"
              }`}
            >
              {node.name}
            </span>
          </div>
          {node.type === "folder" &&
            expanded?.name === node.name &&
            node.children && (
              <FileTree
                nodes={node.children}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                expanded={expanded}
                setExpanded={setExpanded}
                level={level + 1}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default FileTree;
