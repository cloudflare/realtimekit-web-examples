import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { pillsConfig } from "./pills.config";
import { Icon } from "../../components/icons";
import "./style.css";
import sketchyProvider from "../sketchy/sketchyProvider";
import iconsData from "../../components/icons/icons.json";
import Editor from "../editor";
import type { FileNode } from "../editor/FileTree";

interface PillPosition {
  text: string;
  top: string;
  left: string;
  delay: number;
  colorIndex: number;
}

const pillColors = [
  {
    border: "border-blue-500/10 light:border-blue-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-200/20",
  },
  {
    border: "border-purple-500/10 light:border-purple-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-200/50",
  },
  {
    border: "border-pink-500/10 light:border-pink-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-green-500/10 light:border-green-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-yellow-500/10 light:border-yellow-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-orange-500/10 light:border-orange-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-red-500/10 light:border-red-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-cyan-500/10 light:border-cyan-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-indigo-500/10 light:border-indigo-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
  {
    border: "border-teal-500/10 light:border-teal-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50",
  },
];

const SketchyComponent = sketchyProvider(
  () => <i className="text-orange-200 light:text-orange-500">lowest</i>,
  {
    type: "underline",
    color: "#fed7aa",
    offset: 0,
    strokeWidth: 2,
    roughness: 1.5,
  }
);

const NavItem = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <span
    className={`cursor-pointer text-[#858181] light:text-gray-700 p-2 ${className}`}
    onClick={onClick}
  >
    {children}
  </span>
);

const SketchyNavItem = sketchyProvider(NavItem, {
  type: "border",
  color: "#fed7aa",
  strokeWidth: 2,
  roughness: 0.5,
  offset: 8,
});

type Framework = "vanilla" | "react" | "angular";

interface Usecase {
  label: string;
  id: string;
  icon: keyof typeof iconsData;
}

const usecases: Usecase[] = [
  {
    label: "Video",
    id: "video",
    icon: "conferencing",
  },
  {
    label: "Audio",
    id: "audio",
    icon: "audio",
  },
  {
    label: "Webinar",
    id: "webinar",
    icon: "webinar",
  },
  {
    label: "Livestream",
    id: "livestream",
    icon: "livestream",
  },
];

const Hero = ({
  children,
  selectedFramework,
  setSelectedFramework,
}: {
  children: (
    selectedFile: FileNode | null | undefined,
    setSelectedFile: (file: FileNode | null) => void,
    expanded: FileNode | null | undefined,
    setExpanded: React.Dispatch<
      React.SetStateAction<FileNode | null | undefined>
    >
  ) => React.ReactNode;
  selectedFramework: Framework;
  setSelectedFramework: (framework: Framework) => void;
}) => {
  const [pills, setPills] = useState<PillPosition[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const usecaseParam = searchParams.get("usecase");
  const mode = searchParams.get("mode") ?? "editor";
  const [selected, setSelected] = useState<string>(() => {
    if (usecaseParam && usecases.some((u) => u.id === usecaseParam)) {
      return usecaseParam;
    }
    return usecases[0].id;
  });

  const frameworks = useMemo<
    { label: string; id: Framework; disabled: boolean }[]
  >(() => {
    return [
      {
        label: "React",
        id: "react",
        disabled: mode === "token" && selectedFramework !== "react",
      },
      {
        label: "Vanilla",
        id: "vanilla",
        disabled: mode === "token" && selectedFramework !== "vanilla",
      },
      {
        label: "Angular",
        id: "angular",
        disabled: mode === "token" && selectedFramework !== "angular",
      },
    ];
  }, [mode, selectedFramework]);

  // Update URL when selected changes
  useEffect(() => {
    setSearchParams({ usecase: selected }, { replace: true });
  }, [selected, setSearchParams]);

  useEffect(() => {
    // Generate random positions and colors for pills
    const generatedPills = pillsConfig.map((text) => {
      return {
        text,
        top: `${Math.random() * 85 + 5}%`, // 5% to 90%
        left: `${Math.random() * 60 + 15}%`, // 15% to 75%
        delay: Math.random() * 4, // 0s to 4s delay
        colorIndex: Math.floor(Math.random() * pillColors.length),
      };
    });
    setPills(generatedPills);
  }, []);

  return (
    <div className="relative py-18 px-12 w-full h-full min-h-[80vh] overflow-hidden">
      {/* Animated Pills Background */}
      <div className="absolute inset-0 z-0">
        {pills.map((pill, index) => (
          <div
            key={index}
            className="absolute animate-pill-pop"
            style={{
              top: pill.top,
              left: pill.left,
              animationDelay: `${pill.delay}s`,
            }}
          >
            <span
              className={`inline-block px-5 py-2.5 rounded-full border text-sm font-mono backdrop-blur-sm whitespace-nowrap ${
                pillColors[pill.colorIndex].border
              } ${pillColors[pill.colorIndex].text} ${
                pillColors[pill.colorIndex].bg
              }`}
            >
              {pill.text}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-white flex lg:flex-row flex-col h-full gap-2 px-0 min-h-[80vh]">
        {/* left section */}
        <div className="flex-col gap-4 flex-1 flex lg:items-start items-center justify-center min-h-[40vh]">
          <h1 className="text-4xl gap-3 flex font-semibold text-orange-50 light:text-neutral-700">
            Cloudflare's
            <span className="font-handwritten font-normal italic text-orange-500">
              RealtimeKit
            </span>
          </h1>
          <p className="text-lg text-orange-50 light:text-neutral-500">
            Build Realtime AI apps with <SketchyComponent /> latency – at any
            scale!
          </p>
          {/* Framework Navigation */}
          <div className="flex items-center gap-4 my-2">
            {frameworks.map((el) => {
              if (selectedFramework === el.id) {
                return <SketchyNavItem key={el.id}>{el.label}</SketchyNavItem>;
              }
              return (
                <NavItem
                  className={`${el.disabled ? "opacity-40" : ""}`}
                  key={el.id}
                  onClick={() => {
                    if (el.disabled) return;
                    setSelectedFramework(el.id);
                  }}
                >
                  {el.label}
                </NavItem>
              );
            })}
          </div>
          <div className="flex items-center md:justify-start justify-center gap-4 my-4 flex-wrap">
            {usecases.map((usecase) => {
              return (
                <div
                  onClick={() => setSelected(usecase.id)}
                  key={usecase.id}
                  className={`${
                    selected === usecase.id
                      ? "shadow-[0_0px_140px_rgba(104,62,80,0.86)] border-[#423745] light:border-[#dbb3e6] light:shadow-[0_4px_24px_rgba(219,179,230,0.6)]"
                      : "shadow-[0_0px_140px_rgba(104,62,100,0.46)] border-[#1d1d21] light:border-gray-300 light:shadow-[0_4px_24px_rgba(219,179,230,0.3)]"
                  } cursor-pointer px-4 py-2 gap-2 flex flex-row items-center rounded-full bg-black light:bg-neutral-100 border-solid border-[1px]`}
                >
                  <Icon
                    name={usecase.icon}
                    className="text-neutral-400 light:text-neutral-500"
                  />
                  <div className="text-neutral-400 light:text-neutral-500">
                    {usecase.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* right section */}
        <div className="flex flex-col flex-2 min-h-[60vh] min-w-[400px] lg:items-end lg:justify-center items-start justify-start">
          <Editor
            usecase={
              usecases.find((u) => u.id === selected)?.label || "Examples"
            }
          >
            {children}
          </Editor>
        </div>
      </div>
    </div>
  );
};

export default Hero;
