import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import VanillaExample from "./pages/vanilla";
import ReactExample from "./pages/react";
import AngularExample from "./pages/angular";
import Meeting from "./pages/meeting";

type Framework = "vanilla" | "react" | "angular";

const AppContent = () => {
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

  // Render meeting route without layout
  if (location.pathname === "/meeting") {
    return <Meeting />;
  }

  return (
    <div className="dots-background w-full min-h-full flex flex-col justify-start">
      <Header
        selected={selected}
        setSelected={setSelected}
        theme={theme}
        setTheme={setTheme}
      />
      <Routes>
        <Route path="/vanilla" element={<VanillaExample />} />
        <Route path="/react" element={<ReactExample />} />
        <Route path="/angular" element={<AngularExample />} />
        <Route path="/" element={<Navigate to="/react" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
