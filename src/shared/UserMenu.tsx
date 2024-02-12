import {DownOutlined} from "@ant-design/icons";
import {signOut} from "firebase/auth";
import {useMainUser} from "../contexts/MainUser/useMainUser";
import {AUTH} from "../firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import {Menu, MenuItem, MenuHeader} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import i18n from "../i18n";

function UserMenu() {
  const {user} = useMainUser();

  return (
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
            size="40"
            round
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

      <MenuItem
        className="user-menu-icon"
        onClick={() => {
          void signOut(AUTH);
        }}>
        {i18n.t("signOut")}
        <FontAwesomeIcon icon={faRightFromBracket} />
      </MenuItem>
    </Menu>
  );
}

export default UserMenu;
