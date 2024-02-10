import {useContext} from "react";
import {
  SelectedTeamContext,
  type SelectedTeamProviderContextProps,
} from "./SelectedTeamContext";
import type Team from "../../types/Team";

export const useSelectedTeam = (): SelectedTeamProviderContextProps & {
  schedule: Team;
} => {
  const context = useContext(SelectedTeamContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  if (context.schedule == null) {
    throw new Error("No location found.");
  }

  return {...context, schedule: context.schedule};
};

export const useSelectedTeamRaw = (): SelectedTeamProviderContextProps => {
  const context = useContext(SelectedTeamContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
