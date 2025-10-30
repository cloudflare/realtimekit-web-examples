import React from "react";
import { Logo } from "../logo";
import { sketchyProvider } from "../sketchy/sketchyProvider";
import { Icon } from "../icons";

// Create wrapped components with sketchy borders
const NavItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <span
    className="cursor-pointer text-[#858181] light:text-gray-700 px-3 py-5 text-sm"
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
});

// // Circular border
// const SketchyNavItem = sketchyProvider(NavItem, {
//   type: "circle",
//   color: "#fed7aa",
//   strokeWidth: 1,
//   roughness: 0.5,
// });

type Framework = "vanilla" | "react" | "angular";

const Header = ({
  selected,
  setSelected,
  theme,
  setTheme,
}: {
  selected: Framework;
  setSelected: (selected: Framework) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}) => {
  const frameworks: { label: string; id: Framework }[] = [
    {
      label: "Vanilla",
      id: "vanilla",
    },
    {
      label: "React",
      id: "react",
    },
    {
      label: "Angular",
      id: "angular",
    },
  ];

  return (
    <div
      className={`
      z-40 sticky top-4 flex flex-row items-center mx-12 gap-8 px-4 py-0 border-[1px]
     bg-[#040404] rounded-none shadow-[0_8px_100px_rgba(12,17,62,0.76)]  border-zinc-800
     light:bg-white light:shadow-[0_8px_100px_rgba(62,57,122,0.66)] light:border-gray-300
     `}
    >
      <Logo className="text-orange-500 light:fill-none" />
      {frameworks.map((el) => {
        if (selected === el.id) {
          return <SketchyNavItem key={el.id}>{el.label}</SketchyNavItem>;
        }
        return (
          <NavItem key={el.id} onClick={() => setSelected(el.id)}>
            {el.label}
          </NavItem>
        );
      })}
      <div className="flex-grow flex-row items-center justify-end gap-4 hidden md:flex text-[#858181] light:text-gray-500">
        <a target="_blank" href="https://realtime.cloudflare.com/">
          <Icon name="docs" className="cursor-pointer " />
        </a>
        <a
          target="_blank"
          href="https://github.com/cloudflare/realtimekit-web-examples"
        >
          <Icon name="github" className=" cursor-pointer" />
        </a>

        <a
          className="text-orange-500"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Icon name="dark" className="cursor-pointer " />
          ) : (
            <Icon name="light" size={24} className="cursor-pointer " />
          )}
        </a>
      </div>
    </div>
  );
};

export default Header;
