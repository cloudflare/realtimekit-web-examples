import React, { useRef, useEffect, useState } from "react";

interface SketchyBorderProps {
  children: React.ReactNode;
  color?: string;
  strokeWidth?: number;
  roughness?: number;
  className?: string;
}

// Exported function for generating border paths
// eslint-disable-next-line react-refresh/only-export-components
export const generateSketchyBorderPaths = (
  width: number,
  height: number,
  roughness: number
) => {
  if (width === 0 || height === 0) return [];

  const rough = (base: number, variance: number) =>
    base + (Math.random() - 0.5) * variance * roughness;

  // Reference dimensions from the original SVG
  const refMinX = 72;
  const refMaxX = 116;
  const refMinY = 214;
  const refMaxY = 248;
  const refWidth = refMaxX - refMinX;
  const refHeight = refMaxY - refMinY;

  // Scale factors with extension
  const extension = 0.08; // 8% extension beyond edges
  const scaleX = (width * (1 + extension * 2)) / refWidth;
  const scaleY = (height * (1 + extension * 2)) / refHeight;

  // Padding and offset to center the extended shape
  const padding = 4;
  const offsetX = padding - width * extension;
  const offsetY = padding - height * extension;

  // Helper to transform coordinates
  const transformX = (x: number) => rough((x - refMinX) * scaleX + offsetX, 2);
  const transformY = (y: number) =>
    rough((y - refMinY) * scaleY + offsetY, 1.5);

  // Original paths adapted to new dimensions
  const paths = [
    // Top line (horizontal) - stretched to match width
    {
      d: `M${transformX(75)} ${transformY(214)} C${transformX(84)} ${transformY(
        216
      )}, ${transformX(96)} ${transformY(216)}, ${transformX(114)} ${transformY(
        216
      )}`,
    },
    // Right side (vertical)
    {
      d: `M${transformX(113)} ${transformY(217)} C${transformX(
        114
      )} ${transformY(225)}, ${transformX(114)} ${transformY(
        235
      )}, ${transformX(116)} ${transformY(244)}`,
    },
    // Bottom line (horizontal) - stretched to match width
    {
      d: `M${transformX(114)} ${transformY(247)} C${transformX(
        102
      )} ${transformY(245)}, ${transformX(89)} ${transformY(247)}, ${transformX(
        73
      )} ${transformY(248)}`,
    },
    // Left side (vertical)
    {
      d: `M${transformX(74)} ${transformY(244)} C${transformX(75)} ${transformY(
        240
      )}, ${transformX(75)} ${transformY(230)}, ${transformX(74)} ${transformY(
        218
      )}`,
    },
    // Second layer - top
    {
      d: `M${transformX(78)} ${transformY(216)} C${transformX(88)} ${transformY(
        217
      )}, ${transformX(97)} ${transformY(218)}, ${transformX(115)} ${transformY(
        217
      )}`,
    },
    // Second layer - right
    {
      d: `M${transformX(115)} ${transformY(219)} C${transformX(
        116
      )} ${transformY(225)}, ${transformX(114)} ${transformY(
        238
      )}, ${transformX(111)} ${transformY(245)}`,
    },
    // Second layer - bottom
    {
      d: `M${transformX(114)} ${transformY(244)} C${transformX(
        105
      )} ${transformY(249)}, ${transformX(90)} ${transformY(249)}, ${transformX(
        75
      )} ${transformY(246)}`,
    },
    // Second layer - left
    {
      d: `M${transformX(78)} ${transformY(246)} C${transformX(73)} ${transformY(
        240
      )}, ${transformX(77)} ${transformY(232)}, ${transformX(76)} ${transformY(
        219
      )}`,
    },
  ];

  return paths;
};

export const SketchyBorder: React.FC<SketchyBorderProps> = ({
  children,
  color = "#F6821F",
  strokeWidth = 2,
  roughness = 1.5,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const paths = generateSketchyBorderPaths(
    dimensions.width,
    dimensions.height,
    roughness
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="absolute top-0 left-0 overflow-visible pointer-events-none"
          width={dimensions.width + 8}
          height={dimensions.height + 8}
          style={{ transform: "translate(-4px, -4px)" }}
        >
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
      <div className="relative z-10">{children}</div>
    </div>
  );
};
