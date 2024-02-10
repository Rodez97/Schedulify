import {createContext} from "react";
import {type Collaborator} from "../../types/Collaborator";
import type Team from "../../types/Team";
import type Member from "../../types/Member";

export interface SelectedTeamProviderContextProps {
  schedule?: Team;
  loading: boolean;
  error?: Error | undefined;
  members: Member[];
  collaborators: Collaborator[];
  isOwner: boolean;
  isCollaborator: boolean;
  usage: {
    collaborators: number;
    maxCollaborators: number;
    members: number;
    maxMembers: number;
    overLimit: boolean;
  };
}

export const SelectedTeamContext =
  createContext<SelectedTeamProviderContextProps>({
    loading: true,
    members: [],
    collaborators: [],
    isOwner: false,
    isCollaborator: false,
    usage: {
      collaborators: 0,
      maxCollaborators: 0,
      members: 0,
      maxMembers: 0,
      overLimit: false,
    },
  });
