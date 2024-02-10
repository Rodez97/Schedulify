import DarkPageHeader from "./atoms/DarkPageHeader";
import UserMenu from "./organisms/UserMenu";
import InvitationsButton from "./molecules/InvitationsButton";
import {useMainUser} from "../contexts/MainUser/useMainUser";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {
  type CollaboratorRequest,
  CollaboratorRequestConverter,
} from "../Pages/Collaborators/CollaboratorRequest";
import {collection, query, where} from "firebase/firestore";
import {ANALYTICS, FIRESTORE} from "../firebase";
import {useLocation, useNavigate} from "react-router-dom";
import {CloseOutlined, HomeFilled} from "@ant-design/icons";
import logoWithText from "../assets/images/logo-with-text.png";
import {useEffect} from "react";
import {setUserId} from "firebase/analytics";

export function MainHeader() {
  const {user} = useMainUser();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [collaboratorRequests] = useCollectionData<CollaboratorRequest>(
    query(
      collection(FIRESTORE, "collaboratorRequests"),
      where("email", "==", user.email),
      where("status", "==", "pending"),
    ).withConverter(CollaboratorRequestConverter),
    {
      initialValue: [],
    },
  );

  useEffect(() => {
    setUserId(ANALYTICS, user.uid);
  }, [user]);

  return (
    <DarkPageHeader
      backIcon={pathname === "/app" ? <CloseOutlined /> : <HomeFilled />}
      onBack={() => {
        navigate(pathname === "/app" ? "/" : "/app");
      }}
      title={
        <img
          css={{
            height: 25,
            // Turn the logo to full white
            filter: "brightness(0) invert(1)",
            display: "block",
          }}
          src={logoWithText}
          alt="Schedulify logo"
        />
      }
      extra={
        <div
          css={{
            display: "flex",
            alignItems: "center",
          }}>
          {collaboratorRequests != null && collaboratorRequests.length > 0 && (
            <InvitationsButton />
          )}

          <UserMenu />
        </div>
      }
    />
  );
}
