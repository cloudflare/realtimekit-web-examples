import { useContext } from "react";
import { Context } from ".";

export function useSharedState() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useSharedState must be used within a Provider");
  }

  return context;
}
