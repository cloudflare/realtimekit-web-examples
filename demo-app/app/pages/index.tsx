import Grid from "../components/Grid";
import Sidebar from "~/components/Sidebar";



const Index = () => {


  return (
    <div className="w-full h-full dots-background">
    <div className="relative z-10 flex flex-col h-full px-0">
      <div className="flex-col gap-4 flex items-center justify-center my-18">
        <p className="lg:text-lg md:text-base text-sm tracking-widest text-orange-50 light:text-neutral-700 mb-2">EXAMPLES</p>
        <h1 className="lg:text-5xl text-4xl gap-3 flex font-semibold text-orange-50 light:text-neutral-800 text-center">
          Cloudflare RealtimeKit
        </h1>
        <p className="lg:text-2xl md:text-xl text-lg text-center px-12 text-orange-50 light:text-neutral-500 mb-2">
          Build Realtime AI apps with{" "}
          <i className="text-orange-500 light:text-orange-500">lowest</i>{" "}
          latency – at any scale!
        </p>  
      </div>
      <div className="mt-8 bg-neutral-950 light:bg-neutral-50 md:py-12 flex flex-row items-center justify-center py-6 w-full min-h-[60vh]">
      <div className="flex md:flex-row items-start justify-between flex-col w-4/5 max-w-[1200px] gap-4 relative">
        <Sidebar />
        <Grid />
      </div>
      </div>
    </div>
    </div>
  );
};

export default Index;
