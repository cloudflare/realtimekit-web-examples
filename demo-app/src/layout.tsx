import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
// import Meeting from "./pages/meeting";

type Framework = "vanilla" | "react" | "angular";

export default function Layout() {
  const [selected, setSelected] = useState<Framework>("react");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const navigate = useNavigate();
  const location = useLocation();

  // Update body data-theme attribute for all routes
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync selected state with current route
  useEffect(() => {
    const path = location.pathname.substring(1) || "react";
    if (path === "vanilla" || path === "react" || path === "angular") {
      setSelected(path as Framework);
    }
  }, [location.pathname]);

  // Navigate when selected changes, but only if we're not on /meeting route
  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    if (currentPath.includes("meeting")) return;
    navigate(`/${selected}${location.search}`);
  }, [selected, navigate, location.search, location.pathname]);

  return (
    <div className="dots-background w-full min-h-full flex flex-col justify-start">
      {location.pathname !== "/meeting" && (
        <Header
          selected={selected}
          setSelected={setSelected}
          theme={theme}
          setTheme={setTheme}
        />
      )}
      <Outlet /> {/* Render child route here */}
      {location.pathname !== "/meeting" && <Footer />}
    </div>
  );
}
