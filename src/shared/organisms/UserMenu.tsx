import {DownOutlined} from "@ant-design/icons";
import {signOut} from "firebase/auth";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {AUTH, FUNCTIONS} from "../../firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faRightFromBracket,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import {httpsCallable} from "firebase/functions";
import {useCallback, useState} from "react";
import {Menu, MenuItem, MenuHeader} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import i18n from "../../i18n";
import LoadingOverlay from "../atoms/LoadingOverlay";

function UserMenu() {
  const {user, isPremium} = useMainUser();
  const [loadingCustomerPortal, setLoadingCustomerPortal] = useState(false);

  const visitCustomerPortal = useCallback(async () => {
    if (!isPremium) {
      return;
    }

    try {
      setLoadingCustomerPortal(true);

      const createPortalLink = httpsCallable<
        unknown,
        {
          url: string;
        }
      >(FUNCTIONS, "ext-firestore-stripe-payments-createPortalLink");

      const {data} = await createPortalLink({
        returnUrl: window.location.origin,
      });

      window.location.assign(data?.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCustomerPortal(false);
    }
  }, [isPremium]);

  return (
    <>
      <Menu
        menuButton={
          <div
            css={{
              cursor: "pointer",
              display: "flex",
              gap: 5,
              alignItems: "center",
            }}>
            <Avatar
              src={user.photoURL ?? undefined}
              alt={user.displayName ?? undefined}
              name={user.displayName ?? undefined}
              email={user.email ?? undefined}
              size="30"
            />
            <DownOutlined css={{fontSize: 14, color: "#fff"}} />
          </div>
        }
        transition>
        <MenuHeader>{user.email}</MenuHeader>
        <MenuItem className="user-menu-icon" href="/">
          {i18n.t("mySchedules")}
          <FontAwesomeIcon icon={faHouse} />
        </MenuItem>
        <MenuItem className="user-menu-icon" href="/account">
          {i18n.t("account")}
          <FontAwesomeIcon icon={faUser} />
        </MenuItem>

        {isPremium && (
          <MenuItem className="user-menu-icon" onClick={visitCustomerPortal}>
            {i18n.t("subscription")}
            <FontAwesomeIcon icon={faCreditCard} />
          </MenuItem>
        )}

        <MenuItem
          className="user-menu-icon"
          onClick={() => {
            void signOut(AUTH);
          }}>
          {i18n.t("signOut")}
          <FontAwesomeIcon icon={faRightFromBracket} />
        </MenuItem>
      </Menu>

      {/* Loading Overlay */}
      <LoadingOverlay open={loadingCustomerPortal} />
    </>
  );
}

export default UserMenu;
