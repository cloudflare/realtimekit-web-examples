import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import "../../index.css";

type LoadingState = "loaded" | "loading" | "errored";

const Meeting = () => {
  const [search] = useSearchParams();
  const token = search.get("authToken");
  const url = search.get("url") ?? "";
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  if (!token || !url || loadingState === "errored") {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4 text-orange-200 light:text-gray-700">
        <h1 className="text-xl font-bold gap-2 text-orange-100 light:text-gray-900 flex items-center justify-center">
          Uh Oh! Invalid Meeting URL
        </h1>
        <pre className="bg-orange-900/20 border border-orange-700/20 p-2 rounded text-sm">
          Error: {!token && "missing authentication token. "}
          {!url && "missing example url."}
          {loadingState === "errored" &&
            "The example you are trying to run does not exist."}
        </pre>
        <Link
          to="/"
          className="px-4 py-2 bg-orange-900/30 hover:bg-orange-800/40 light:bg-amber-500 light:hover:bg-amber-600 
          text-orange-100 light:text-white border border-orange-700/50 light:border-amber-600 
          rounded transition-colors font-medium"
        >
          ← Back to Examples
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {loadingState === "loading" && (
        <div className="w-full min-h-screen flex absolute z-40 flex-col justify-center items-center gap-4 text-orange-200 light:text-gray-700">
          <pre className="bg-orange-900/20 border border-orange-700/20 p-2 rounded text-sm">
            Loading...
          </pre>
        </div>
      )}
      <iframe
        src={`${url}?authToken=${token}`}
        className="w-full h-[100vh] border-none"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        onError={() => setLoadingState("errored")}
        onLoad={() => setLoadingState("loaded")}
      />
    </div>
  );
};

export default Meeting;
