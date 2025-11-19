import { Logo } from "../logo";
import { Icon } from "../icons";

const Header = ({
  theme,
  setTheme,
}: {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}) => {
  return (
    <div
      className={`
      z-40 sticky top-4 flex flex-row items-center mx-12 gap-8 px-4 py-0 border-[1px]
     bg-[#040404] rounded-none shadow-[0_8px_100px_rgba(12,17,62,0.76)]  border-zinc-800
     light:bg-white light:shadow-[0_8px_100px_rgba(62,57,122,0.66)] light:border-gray-300
     `}
    >
      <Logo className="text-orange-500 light:fill-none" />
      <div className="flex-grow flex-row items-center justify-end gap-4 flex text-[#858181] light:text-gray-500">
        <a
          target="_blank"
          href="https://realtime.cloudflare.com/"
          className="flex items-center justify-center py-4"
        >
          <Icon size={24} name="docs" className="cursor-pointer " />
        </a>
        <a
          target="_blank"
          className="flex items-center justify-center py-4"
          href="https://github.com/cloudflare/realtimekit-web-examples"
        >
          <Icon size={24} name="github" className=" cursor-pointer" />
        </a>

        <a
          className="text-orange-500 flex items-center justify-center py-4"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Icon name="dark" className="cursor-pointer " />
          ) : (
            <Icon name="light" size={26} className="cursor-pointer " />
          )}
        </a>
      </div>
    </div>
  );
};

export default Header;
