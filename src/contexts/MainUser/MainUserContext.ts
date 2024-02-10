import {createContext} from "react";
import {type MainUserContextProps} from "./types";

export const MainUserContext = createContext<MainUserContextProps>({
  user: undefined,
  onError: () => undefined,
  loading: true,
  error: undefined,
  createFirstSchedule: async () => undefined,
});
