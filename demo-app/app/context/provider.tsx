import React, { useEffect, useState } from "react";
import { Context, type Framework, type Theme, type Usecase } from ".";
import { useLocation, useNavigate } from "react-router";
import { modes } from "~/utils/utils";

type ProviderProps = {
  children: React.ReactNode;
};

export function ContextProvider({ children }: ProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [activeMode, setActiveMode] = useState(modes[0]);
  const [usecase, setUsecase] = useState<Usecase>("video");
  const [framework, setFramework] = useState<Framework>("react");
  
  const [theme, setTheme] = useState<Theme>("light");

  // update theme attribute on body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync framework state with current route
  useEffect(() => {
    const path = location.pathname.substring(1) || "react";
    if (path === "html" || path === "react" || path === "angular") {
      setFramework(path as Framework);
    }
  }, [location.pathname]);

  // Sync usecase state with `usecase` query param
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const qpUsecase = searchParams.get("usecase");

    if (
      qpUsecase === "video" ||
      qpUsecase === "audio" ||
      qpUsecase === "webinar" ||
      qpUsecase === "livestream"
    ) {
      setUsecase(qpUsecase as Usecase);
    }
  }, [location.search]);

  // Navigate to the correct page when framework or usecase changes, but only if we're not on /meeting route
  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    if (currentPath.includes("meeting")) return;
    const searchParams = new URLSearchParams(location.search);
    if (usecase) {
      searchParams.set("usecase", usecase);
    }
    const search = searchParams.toString();
    navigate(`/${framework}${search ? `?${search}` : ""}`, { replace: true });
  }, [framework, usecase, navigate, location.search, location.pathname]);

  const value = {
    theme,
    setTheme,
    framework,
    setFramework,
    usecase,
    setUsecase,
    activeMode,
    setActiveMode,
    search, setSearch,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
