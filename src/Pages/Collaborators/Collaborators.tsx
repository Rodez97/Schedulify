import {Button, Layout, Tabs} from "antd";
import {useMemo, useState} from "react";
import GrayPageHeader from "../../shared/GrayPageHeader";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import Invitations from "./Invitations";
import InviteCollaborator from "./InviteCollaborator";
import CollaboratorsList from "./CollaboratorsList";
import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {
  type CollaboratorRequest,
  CollaboratorRequestConverter,
} from "./CollaboratorRequest";
import {collection, query, where} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import LoadingPage from "../../shared/LoadingPage";
import ErrorPage from "../../shared/PageError";

function Collaborators() {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [inviteCollaboratorVisible, setInviteCollaboratorVisible] =
    useState(false);
  const {schedule} = useSelectedTeam();
  const [collaboratorRequests, loading, error] =
    useCollectionData<CollaboratorRequest>(
      query(
        collection(FIRESTORE, "collaboratorRequests"),
        where("scheduleId", "==", schedule.id),
      ).withConverter(CollaboratorRequestConverter),
      {
        initialValue: [],
      },
    );

  const remainingInvitations = useMemo(() => {
    const currentCollaborators = schedule.collaborators?.length ?? 0;
    const currentInvitations =
      collaboratorRequests != null ? collaboratorRequests.length : 0;
    const total = currentCollaborators + currentInvitations;

    const maxCollaborators = schedule.limits.collaborators;
    return maxCollaborators - total;
  }, [
    collaboratorRequests,
    schedule.collaborators,
    schedule.limits.collaborators,
  ]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  return (
    <Layout css={{overflowX: "auto"}}>
      <GrayPageHeader
        onBack={() => {
          navigate(-1);
        }}
        title={t("collaborators.count {{0}} {{1}}", {
          0: schedule.collaborators?.length ?? 0,
          1: schedule.limits.collaborators,
        })}
        extra={
          <Button
            onClick={() => {
              setInviteCollaboratorVisible(true);
            }}
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            type="dashed"
            disabled={remainingInvitations <= 0}>
            {t("collaborators.invite.btn")}
          </Button>
        }
      />
      <Layout.Content>
        <Tabs
          type="card"
          items={[
            {
              label: t("collaborators.total {{0}}", {
                0:
                  schedule.collaborators != null
                    ? schedule.collaborators.length
                    : 0,
              }),
              key: "1",
              children: <CollaboratorsList />,
            },
            {
              label: t(`collaborators.pending.invitation {{0}}`, {
                0:
                  collaboratorRequests != null
                    ? collaboratorRequests.length
                    : 0,
              }),
              key: "2",
              children: (
                <Invitations
                  remainingInvitations={remainingInvitations}
                  collaboratorRequests={collaboratorRequests}
                />
              ),
            },
          ]}
        />
      </Layout.Content>

      <InviteCollaborator
        open={inviteCollaboratorVisible}
        onCancel={() => {
          setInviteCollaboratorVisible(false);
        }}
        onClose={() => {
          setInviteCollaboratorVisible(false);
        }}
        invitations={collaboratorRequests ?? []}
      />
    </Layout>
  );
}

export default Collaborators;
