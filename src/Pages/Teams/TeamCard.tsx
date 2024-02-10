import {Card, Dropdown, type MenuProps, Modal} from "antd/es";
import {useTranslation} from "react-i18next";
import {type ReactNode, useCallback, useMemo} from "react";
import {MoreOutlined} from "@ant-design/icons";
import type Team from "../../types/Team";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {useNavigate} from "react-router-dom";
import {deleteDoc, doc} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import styled from "@emotion/styled";

interface TeamCardProps {
  team: Team;
  actions?: ReactNode[];
  showBadge?: boolean;
  onEdit: (team: Team) => void;
}

export default function TeamCard({team, actions, onEdit}: TeamCardProps) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {user} = useMainUser();

  const handleSelectLocation = useCallback(async () => {
    const isOwner = team.ownerId === user.uid;
    const isCollaborator =
      team.collaborators != null && team.collaborators.includes(user.uid);
    const isMember =
      user.email != null &&
      team.members != null &&
      team.members.includes(user.email);

    let targetLink = "";

    if (isOwner || isCollaborator) {
      targetLink = `/schedule/${team.id}`;
    } else if (isMember) {
      targetLink = `/viewSchedule/${team.id}`;
    }

    if (targetLink.length === 0) {
      return;
    }

    // Otherwise, navigate to the location page
    try {
      navigate(targetLink, {
        replace: true,
      });
    } catch (error) {
      // If an error occurs, record it
    }
  }, [
    navigate,
    team.collaborators,
    team.id,
    team.members,
    team.ownerId,
    user.email,
    user.uid,
  ]);

  const items: MenuProps["items"] = [
    {
      label: t("schedule.edit"),
      key: "0",
    },
    {
      label: t("schedule.delete"),
      key: "1",
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = useMemo(
    () => e => {
      e.domEvent.stopPropagation();
      e.domEvent.preventDefault();
      if (e.key === "1") {
        Modal.confirm({
          title: t("schedule.delete"),
          content: t("schedule.delete.description"),
          okText: t("btn.delete"),
          okType: "danger",
          cancelText: t("btn.cancel"),
          onOk: async () => {
            const scheduleRef = doc(FIRESTORE, "schedules", team.id);
            await deleteDoc(scheduleRef);
          },
        });
      }
      if (e.key === "0") {
        onEdit(team);
      }
    },
    [onEdit, team, t],
  );

  return (
    <StyledCard
      hoverable
      onClick={handleSelectLocation}
      actions={actions}
      color={team.color}
      extra={
        team.ownerId === user.uid && (
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}>
            <MoreOutlined
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="mode-button"
            />
          </Dropdown>
        )
      }
      title={team.name}
    />
  );
}

const StyledCard = styled(Card)<{color: string}>`
  width: 200px !important;

  .ant-card-body {
    background-color: ${props => props.color};
  }

  .ant-card-meta-title {
    color: inherit;
  }
  .ant-card-meta-description {
    color: inherit;
  }
  .card-base {
    width: 270px;
    height: 120px;
    background-color: #fff;
    color: #000;
  }
  .card-actions {
    height: 180px;
  }
  .card-deleting {
    background: repeating-linear-gradient(
      -45deg,
      #f33d61,
      #f33d61 10px,
      #e76e8a 10px,
      #e76e8a 20px
    );
    color: #fff !important;
  }

  .mode-button {
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    padding: 4px;
    font-size: 12px;
  }
`;
