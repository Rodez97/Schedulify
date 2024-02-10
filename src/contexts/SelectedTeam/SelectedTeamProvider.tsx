import {type ReactNode, useMemo} from "react";
import {useSelectedTeamData} from "./useSelectedTeamData";
import {useParams} from "react-router-dom";
import LoadingPage from "../../shared/molecules/LoadingPage";
import {useMainUser} from "../MainUser/useMainUser";
import {SelectedTeamContext} from "./SelectedTeamContext";

export const SelectedTeamProvider = ({children}: {children: ReactNode}) => {
  const {user} = useMainUser();
  const {scheduleId} = useParams<{scheduleId: string}>();

  if (scheduleId == null) {
    throw new Error("No scheduleId found.");
  }

  const {loading, error, schedule, scheduleMembership} =
    useSelectedTeamData(scheduleId);

  const usage = useMemo(() => {
    const collaborators = schedule?.collaborators?.length ?? 0;
    const maxCollaborators = schedule?.limits?.collaborators ?? 0;
    const members = schedule?.members?.length ?? 0;
    const maxMembers = schedule?.limits?.members ?? 0;
    const overLimit = collaborators > maxCollaborators || members > maxMembers;
    return {
      collaborators,
      maxCollaborators,
      members,
      maxMembers,
      overLimit,
    };
  }, [
    schedule?.collaborators,
    schedule?.limits?.collaborators,
    schedule?.members,
    schedule?.limits?.members,
  ]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <SelectedTeamContext.Provider
      value={{
        schedule,
        loading,
        error,
        members: Object.values(scheduleMembership?.members ?? {}),
        collaborators: Object.values(scheduleMembership?.collaborators ?? {}),
        isOwner: schedule?.ownerId === user.uid,
        isCollaborator: Boolean(schedule?.collaborators?.includes(user.uid)),
        usage,
      }}>
      {children}
    </SelectedTeamContext.Provider>
  );
};
