/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Logo } from "../logo";
import type { FileNode } from "./FileTree";
import { addParticipant, createMeeting } from "../../api";
import { useNavigate } from "react-router-dom";

const Editor = ({
  children,
  usecase,
}: {
  children: (
    selectedFile: FileNode | null | undefined,
    setSelectedFile: (file: FileNode | null) => void,
    expanded: FileNode | null | undefined,
    setExpanded: React.Dispatch<
      React.SetStateAction<FileNode | null | undefined>
    >
  ) => React.ReactNode;
  usecase: string;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState<FileNode | null>();
  const [selectedFile, setSelectedFile] = useState<FileNode | null | undefined>(
    null
  );
  const [terminalOutput, setTerminalOutput] = useState<string>("$ rtk ~\n");
  const navigate = useNavigate();

  useEffect(() => {
    if (!formRef.current) return;
    const input = formRef.current.querySelector("input");
    input?.focus();
    setTerminalOutput("$ rtk ~\n");
  }, [formRef.current, selectedFile]);

  const submit = async () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const name = data.get("name") as string;
    const meetingName = data.get("meeting-title") as string;
    let meetingId = data.get("meeting-id") as string;

    if (!meetingId && !meetingName) {
      setTerminalOutput((prev) => {
        return `${prev}$ rtk ~ <span style="color: red;">✗ error: meeting ${
          selectedFile?.name.includes("create") ? "name" : "id"
        } is required</span>\n`;
      });
      return;
    }

    setTerminalOutput((prev) => {
      return `${prev}$ rtk ~ creating meeting...\n`;
    });

    // create a new meeting
    if (meetingName) {
      try {
        const { data } = await createMeeting(meetingName);
        setTerminalOutput((prev) => {
          return `${prev}$ rtk ~ <span style="color: green;">✓ meeting created</span>\n`;
        });
        meetingId = data.id;
      } catch (error: unknown) {
        setTerminalOutput((prev) => {
          return `${prev}$ rtk ~ <span style="color: red;">✗ error: ${
            error instanceof Error ? error.message : "could not create meeting"
          }</span>\n`;
        });
      }
    }

    setTerminalOutput((prev) => {
      return `${prev}$ rtk ~ generating auth token...\n`;
    });

    // create a participant
    try {
      const { data } = await addParticipant(
        name,
        meetingId,
        selectedFile?.preset ?? "group_call_host"
      );
      setTerminalOutput((prev) => {
        return `${prev}$ rtk ~ <span style="color: green;">✓ auth token generated. Joining meeting...</span>\n`;
      });
      navigate(`/meeting?token=${data.token}&example=${expanded?.name}`);
    } catch (error: unknown) {
      setTerminalOutput((prev) => {
        return `${prev}$ rtk ~ <span style="color: red;">✗ error: ${
          error instanceof Error ? error.message : "could not join meeting"
        }</span>\n`;
      });
    }
  };

  return (
    <div
      className={`flex w-full h-[80vh] lg:h-[80%] lg:w-[80%] rounded-none overflow-hidden border
        bg-black border-orange-200/20 shadow-[0_8px_180px_rgba(84,61,8,0.2)]
        light:bg-white light:border-amber-400 light:shadow-[0_8px_180px_rgba(251,191,36,0.2)]`}
    >
      {/* Sidebar */}
      <div className="w-64 bg-[#080808] light:bg-gray-50 border-r border-orange-200/20 light:border-amber-400 overflow-y-auto">
        <div className="p-2 border-b border-orange-200/20 light:border-amber-400">
          <div className="text-orange-100 light:text-gray-700 text-xs font-semibold">
            {usecase} Examples
          </div>
        </div>
        {children(selectedFile, setSelectedFile, expanded, setExpanded)}
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        {selectedFile && (
          <div className="bg-[#080808] light:bg-gray-100 border-b border-orange-200/20 light:border-amber-400 px-4 py-1">
            <span className="text-orange-300 light:text-gray-700 text-sm">
              {expanded?.name} / {selectedFile.name}
            </span>
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 p-4 overflow-auto min-h-0">
          {selectedFile ? (
            <form ref={formRef}>
              <div className="font-mono text-white light:text-gray-500">
                <div>
                  <span className="text-gray-600 text-sm mr-2">1. </span>
                  <span className="text-sm text-lime-800 light:text-lime-600">
                    {selectedFile.content}
                  </span>
                </div>
                <div className="text-sm gap-1 flex flex-col">
                  <div>
                    <span className="text-gray-600 text-sm mr-2">2. </span>
                    <span className="text-blue-400/60 light:text-blue-600">
                      const{" "}
                    </span>
                    <span className="text-blue-400/80 light:text-blue-500">
                      meeting
                    </span>{" "}
                    ={" "}
                    <span className="text-blue-400/80 light:text-blue-500">
                      RealtimeKitClient
                    </span>
                    .
                    <span className="text-amber-200/80 light:text-amber-600">
                      config(
                    </span>
                    <span className="text-fuchsia-300 light:text-fuchsia-700">{`{`}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm mr-2">3. </span>
                    <span className="text-cyan-200/80 light:text-cyan-600">
                      &ensp; name:{" "}
                    </span>
                    <input
                      name="name"
                      type="text"
                      className="text-white italic border-[1px] light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5"
                      placeholder="Amelia James"
                    />
                    <span className="text-sm text-lime-800 light:text-lime-600">
                      {" "}
                      // input name here
                    </span>
                  </div>
                  {selectedFile.name.includes("create") && (
                    <div>
                      <span className="text-gray-600 text-sm mr-2">4. </span>
                      <span className="text-cyan-200/80 light:text-cyan-600">
                        &ensp; meeting-title:{" "}
                      </span>
                      <input
                        name="meeting-title"
                        type="text"
                        className="text-white italic border-[1px] light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5"
                        placeholder="Sprint Retrospective"
                      />
                    </div>
                  )}
                  {selectedFile.name.includes("join") && (
                    <div>
                      <span className="text-gray-600 text-sm mr-2">4. </span>
                      <span className="text-cyan-200/80 light:text-cyan-600">
                        &ensp; meeting-id:{" "}
                      </span>
                      <input
                        name="meeting-id"
                        type="text"
                        className="text-white italic border-[1px] light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5"
                        placeholder="****-44556"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 text-sm mr-2">5. </span>
                    <span className="text-fuchsia-300 light:text-fuchsia-700">{`}`}</span>
                    <span className="text-amber-200/80 light:text-amber-600">
                      )
                    </span>
                    ;
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm mr-2">6. </span>
                    <span className="text-blue-400/80 light:text-blue-500">
                      meeting
                    </span>
                    .
                    <span className="text-amber-200/80 light:text-amber-600">
                      join
                    </span>
                    <span className="text-fuchsia-300 light:text-fuchsia-700">{`()`}</span>
                    ;
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center flex-col gap-4 justify-center h-full text-orange-200 light:text-gray-500 text-sm">
              <Logo size={60} className="text-orange-500 light:fill-none" />
              <p className="w-[50%] text-center text-thin">
                Get started with RealtimeKit examples. Select an example to try.
              </p>
            </div>
          )}
        </div>

        {/* Terminal */}
        <div className="grow border-t border-orange-200/20 light:border-amber-400 bg-[#040404] light:bg-slate-800 flex flex-col">
          <div className="px-4 py-1 border-b border-orange-200/20 light:border-gray-300 bg-[#080808] light:bg-slate-700">
            <span className="text-orange-100 light:text-gray-200 text-xs font-semibold">
              Terminal
            </span>
          </div>
          <div className="flex-1 p-4 overflow-auto flex flex-col gap-3">
            <pre
              className="text-orange-200 light:text-green-400 font-mono text-xs whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: terminalOutput }}
            />
            {selectedFile && (
              <button
                className="cursor-pointer px-4 py-2 font-mono text-xs bg-orange-900/30 hover:bg-orange-800/40 light:bg-slate-600 light:hover:bg-slate-500 text-orange-100 light:text-gray-100 border border-orange-700/50 light:border-slate-500 rounded transition-colors w-fit"
                onClick={submit}
              >
                $ join now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
