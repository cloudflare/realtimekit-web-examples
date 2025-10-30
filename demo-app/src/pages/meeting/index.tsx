import { Link, useSearchParams } from "react-router-dom";
import "../../App.css";
import { Icon } from "../../components/icons";

const Meeting = () => {
  const [search] = useSearchParams();
  const token = search.get("token");
  const example = search.get("example");

  if (!token || !example) {
    return (
      <div className="dots-background w-full min-h-screen flex flex-col justify-center items-center gap-4 text-orange-200 light:text-gray-700">
        <h1 className="text-2xl font-bold gap-2 text-orange-100 light:text-gray-900 flex items-center justify-center">
          <Icon size={28} name="warning" /> Invalid Meeting URL
        </h1>
        <p className="text-center max-w-md text-orange-200/80 light:text-gray-600">
          This meeting link appears to be broken or incomplete.
          {!token && "Missing authentication token. "}
          {!example && "Missing example name."}
        </p>
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
    <div className="size-full text-neutral-50">
      TODO: Load {example} Component with {token}
    </div>
  );
};

export default Meeting;
