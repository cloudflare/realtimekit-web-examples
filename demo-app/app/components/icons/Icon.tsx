import React from "react";
import iconsData from "./icons.json";

export type IconName = keyof typeof iconsData;

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = "",
  color = "currentColor",
}) => {
  const svgString = iconsData[name];

  if (!svgString || svgString.trim() === "") {
    console.warn(`Icon "${name}" not found or empty in icons.json`);
    return null;
  }

  // Parse and modify the SVG string
  let modifiedSvg = svgString;

  // Replace or add fill attribute
  if (modifiedSvg.includes("fill='currentColor'")) {
    modifiedSvg = modifiedSvg.replace(
      /fill='currentColor'/g,
      `fill='${color}'`
    );
  } else if (modifiedSvg.includes('fill="currentColor"')) {
    modifiedSvg = modifiedSvg.replace(
      /fill="currentColor"/g,
      `fill="${color}"`
    );
  }

  // Add width, height, and class to the SVG tag
  modifiedSvg = modifiedSvg.replace(
    /<svg/,
    `<svg width="${size}" height="${size}" class="${className}"`
  );

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
    />
  );
};

export default Icon;
