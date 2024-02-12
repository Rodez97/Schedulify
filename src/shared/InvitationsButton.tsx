import {useCollectionData} from "react-firebase-hooks/firestore";
import {
  type CollaboratorRequest,
  CollaboratorRequestConverter,
} from "../Pages/Collaborators/CollaboratorRequest";
import {
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {FIRESTORE} from "../firebase";
import {useMainUser} from "../contexts/MainUser/useMainUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {css} from "@emotion/react";
import React, {useState} from "react";
import {Card, Drawer} from "antd";
import {useTranslation} from "react-i18next";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {Colors} from "../utils/Colors";

const cssInfiniteShakingAnimation = css`
  animation: shake 2s infinite;
  transform: translate3d(0, 0, 0);
  margin-right: 10px;
  cursor: pointer;

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-2px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(2px, 0, 0);
    }
  }

  &:hover {
    animation: none;
  }
`;

function InvitationsButton() {
  const {t} = useTranslation();
  const {user} = useMainUser();
  const [isOpen, setIsOpen] = useState(false);
  const [collaboratorRequests, loading, error] =
    useCollectionData<CollaboratorRequest>(
      query(
        collection(FIRESTORE, "collaboratorRequests"),
        where("email", "==", user.email),
        where("status", "==", "pending"),
      ).withConverter(CollaboratorRequestConverter),
      {
        initialValue: [],
      },
    );

  const handleAccept = async (collabRequest: CollaboratorRequest) => {
    const documentRef = doc(
      FIRESTORE,
      "collaboratorRequests",
      collabRequest.id,
    );
    await updateDoc(documentRef, {
      status: "accepted",
    });
  };

  const handleReject = async (collabRequest: CollaboratorRequest) => {
    const documentRef = doc(
      FIRESTORE,
      "collaboratorRequests",
      collabRequest.id,
    );
    await deleteDoc(documentRef);
  };

  if (
    loading ||
    error != null ||
    collaboratorRequests == null ||
    collaboratorRequests?.length === 0
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <FontAwesomeIcon
        icon={faBell}
        color="#fff"
        css={cssInfiniteShakingAnimation}
        size="lg"
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <Drawer
        title={t("invitation.requests")}
        placement="right"
        closable={true}
        onClose={() => {
          setIsOpen(false);
        }}
        open={isOpen}
        width={400}>
        {collaboratorRequests.map(collabRequest => {
          return (
            <Card
              key={collabRequest.id}
              css={{width: "100%"}}
              actions={[
                <CheckOutlined
                  key="accept"
                  css={{
                    color: Colors.Green.Main,
                  }}
                  onClick={() => {
                    void handleAccept(collabRequest);
                  }}
                />,
                <CloseOutlined
                  key="reject"
                  css={{
                    color: Colors.Error.errorMain,
                  }}
                  onClick={() => {
                    void handleReject(collabRequest);
                  }}
                />,
              ]}>
              <Card.Meta
                title={t("invitation.request")}
                description={collabRequest.name}
              />
            </Card>
          );
        })}
      </Drawer>
    </React.Fragment>
  );
}

export default InvitationsButton;
