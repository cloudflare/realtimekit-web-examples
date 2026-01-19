import { Logo } from "./Logo";
import { Icon } from "./icons";
import { useSharedState } from "../context/hook";
import { useNavigate } from "react-router";

const Header = () => {
  const { theme, setTheme } = useSharedState();
  const navigate = useNavigate();
  
  return (
    <div
      className={`
      fixed z-40 top-4 left-0 right-0 flex flex-row items-center gap-8 px-13 py-0`}
    >
      <Logo className="text-orange-500 light:fill-none cursor-pointer" onClick={() => navigate('/')} />
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
