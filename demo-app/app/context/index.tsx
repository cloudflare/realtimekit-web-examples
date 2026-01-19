/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

export type Theme = "dark" | "light";

export type Framework = "html" | "react" | "angular";

export type Usecase = "video" | "audio" | "webinar" | "livestream" | "all";

export type ContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  framework: Framework;
  setFramework: (framework: Framework) => void;
  usecase: Usecase;
  setUsecase: (usecase: Usecase) => void;
  activeMode: any;
  setActiveMode: (activeMode: any) => void;
  search: string;
  setSearch: (search: string) => void;
};

export const Context = createContext<ContextValue | undefined>(undefined);
