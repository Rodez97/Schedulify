import {Divider} from "antd/es";
import {useTranslation} from "react-i18next";
import TeamCard from "./TeamCard";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import type Team from "../../types/Team";
import {Fragment, useCallback, useMemo} from "react";

export default function MyTeams({
  onEdit,
  teams,
}: {
  onEdit: (team: Team) => void;
  teams: Team[];
}) {
  const {t} = useTranslation();
  const {user} = useMainUser();

  const renderTeamCards = useCallback(
    (schedule: Team) => (
      <TeamCard key={schedule.id} team={schedule} onEdit={onEdit} />
    ),
    [onEdit],
  );

  const groupedSchedules = useMemo(() => {
    const groupedSchedules: Record<string, Team[]> = {};
    teams.forEach(schedule => {
      const isOwner = schedule.ownerId === user.uid;
      const isCollaborator =
        schedule.collaborators != null &&
        schedule.collaborators.includes(user.uid);
      const isMember =
        user.email != null &&
        schedule.members != null &&
        schedule.members.includes(user.email);
      const key = isOwner
        ? "owner"
        : isCollaborator
          ? "collaborator"
          : isMember
            ? "member"
            : "other";

      if (groupedSchedules[key] == null) {
        groupedSchedules[key] = [];
      }
      groupedSchedules[key].push(schedule);
    });
    return groupedSchedules;
  }, [teams, user.email, user.uid]);

  return (
    <div>
      <div style={{gap: "16px", width: "100%"}}>
        {groupedSchedules?.owner?.length !== 0 && (
          <Fragment>
            <Divider orientation="left">
              {t("owner")}
              {` (${groupedSchedules.owner.length}/3)`}
            </Divider>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                width: "100%",
              }}>
              {groupedSchedules?.owner?.map(renderTeamCards)}
            </div>
          </Fragment>
        )}

        {groupedSchedules?.collaborator?.length !== 0 && (
          <Fragment>
            <Divider orientation="left">{t("collaborator")}</Divider>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                width: "100%",
              }}>
              {groupedSchedules?.collaborator?.map(renderTeamCards)}
            </div>
          </Fragment>
        )}

        {groupedSchedules?.member?.length !== 0 && (
          <Fragment>
            <Divider orientation="left">{t("member")}</Divider>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                width: "100%",
              }}>
              {groupedSchedules?.member?.map(renderTeamCards)}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
