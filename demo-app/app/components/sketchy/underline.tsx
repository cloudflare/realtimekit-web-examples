import React, { useRef, useEffect, useState } from "react";

interface SketchyUnderlineProps {
  children: React.ReactNode;
  color?: string;
  strokeWidth?: number;
  roughness?: number;
  offset?: number;
  borderRadius?: number;
  className?: string;
}

// Exported function for generating underline paths
// eslint-disable-next-line react-refresh/only-export-components
export const generateSketchyUnderlinePaths = (
  width: number,
  height: number,
  roughness: number,
  offset: number
) => {
  if (width === 0 || height === 0) return [];

  const rough = (base: number, variance: number) =>
    base + (Math.random() - 0.5) * variance * roughness;

  // Reference dimensions from the original SVG (same as border)
  const refMinX = 72;
  const refMaxX = 116;
  const refWidth = refMaxX - refMinX;

  // Scale factors with extension
  const extension = 0.08; // 8% extension beyond edges
  const scaleX = (width * (1 + extension * 2)) / refWidth;

  // Padding and offset to center the extended shape
  const padding = 4;
  const offsetX = padding - width * extension;
  // Position at bottom of content plus offset - simplified to just position the line
  const baseY = height + offset;

  // Helper to transform coordinates
  const transformX = (x: number) => rough((x - refMinX) * scaleX + offsetX, 2);
  // For Y, we map the reference Y coordinates to a single line at baseY
  // The original bottom paths had Y coords around 244-249, so we normalize around that
  const transformY = (y: number) => {
    // Map reference Y range to be centered around baseY
    const normalizedY = (y - 246.5) * 0.3; // 246.5 is midpoint of 244-249, scale down the variance
    return rough(baseY + normalizedY, 1.5);
  };

  // Use the same bottom paths as the border component
  const paths = [
    // Bottom line (horizontal) - same as border's bottom edge
    {
      d: `M${transformX(114)} ${transformY(247)} C${transformX(
        102
      )} ${transformY(245)}, ${transformX(89)} ${transformY(247)}, ${transformX(
        73
      )} ${transformY(248)}`,
    },
    // Second layer - bottom - same as border's second layer
    {
      d: `M${transformX(114)} ${transformY(244)} C${transformX(
        105
      )} ${transformY(249)}, ${transformX(90)} ${transformY(249)}, ${transformX(
        75
      )} ${transformY(246)}`,
    },
  ];

  return paths;
};

export const SketchyUnderline: React.FC<SketchyUnderlineProps> = ({
  children,
  color = "#F6821F",
  strokeWidth = 2,
  roughness = 1.5,
  offset = 4,
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

  const paths = generateSketchyUnderlinePaths(
    dimensions.width,
    dimensions.height,
    roughness,
    offset
  );

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={dimensions.width}
          height={dimensions.height + offset + 10}
          style={{ overflow: "visible" }}
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
      <span className="relative z-10">{children}</span>
    </div>
  );
};
