import { Outlet, useLocation } from "react-router";
import { ContextProvider } from "./context/provider";
import Header from "~/components/RTKHeader";
import Footer from "~/components/RTKFooter";

export default function Layout() {
  const location = useLocation();
  const isMeetingPage = location.pathname === '/meeting';

  if (isMeetingPage) {
    return <ContextProvider><Outlet /></ContextProvider>
  }
  
  return (
    <ContextProvider>
      <div className="relative box-border bg-neutral w-full min-h-screen pt-24 pb-10 flex flex-col">
        <Header />
        <div className="flex-1 w-full md:z-0 z-[90000]">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ContextProvider>
  );
}
