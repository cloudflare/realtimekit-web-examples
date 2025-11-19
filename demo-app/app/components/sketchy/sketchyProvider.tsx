import React, { useRef, useEffect, useState } from "react";
import { generateSketchyBorderPaths } from "./border";
import { generateSketchyUnderlinePaths } from "./underline";
import { generateSketchyCirclePaths } from "./circle";

type SketchyType = "border" | "underline" | "circle";

interface SketchyConfig {
  type?: SketchyType;
  color?: string;
  strokeWidth?: number;
  roughness?: number;
  offset?: number; // For underline only
}

export const sketchyProvider = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: SketchyConfig = {}
) => {
  return (props: P) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const {
      type = "border",
      color = "#30A46C",
      strokeWidth = 2,
      roughness = 1.2,
      offset = 4,
    } = config;

    useEffect(() => {
      if (containerRef.current) {
        const updateDimensions = () => {
          if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            setDimensions({ width: offsetWidth, height: offsetHeight });
          }
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
      }
    }, []);

    const paths =
      type === "underline"
        ? generateSketchyUnderlinePaths(
            dimensions.width,
            dimensions.height,
            roughness,
            offset
          )
        : type === "circle"
        ? generateSketchyCirclePaths(
            dimensions.width,
            dimensions.height,
            roughness
          )
        : generateSketchyBorderPaths(
            dimensions.width + offset,
            dimensions.height + offset,
            roughness
          );

    const svgProps =
      type === "underline"
        ? {
            className: "absolute inset-0 pointer-events-none",
            width: dimensions.width,
            height: dimensions.height + offset + 10,
            style: { overflow: "visible" as const },
          }
        : type === "circle"
        ? {
            className:
              "absolute inset-0 overflow-visible pointer-events-none flex items-center justify-center",
            width: dimensions.width + 16,
            height: dimensions.height + 16,
            style: { transform: "translate(-8px, -8px)" },
          }
        : {
            className: "absolute inset-0 overflow-visible pointer-events-none",
            width: dimensions.width + offset,
            height: dimensions.height + offset,
            style: {
              transform: `translate(-${offset}px, -${offset}px)`,
            },
          };

    return (
      <div ref={containerRef} className="relative inline-block">
        {dimensions.width > 0 && dimensions.height > 0 && (
          <svg {...svgProps}>
            {paths.map((path, index) => (
              <path
                key={index}
                d={path.d}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        )}
        <div className="relative z-10">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default sketchyProvider;
