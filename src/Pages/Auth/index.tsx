import {Layout} from "antd/es";
import ColorLogo from "../../assets/images/logo-with-text.png";
import AuthFooter from "./AuthFooter";
import AuthRouter from "./AuthPage";
import "./Auth.scss";

export default function AuthPages() {
  return (
    <Layout className="wrapper">
      <main className="wrapper__content">
        <picture className="wrapper__logo">
          <img src={ColorLogo} alt="Schedulify" height={40} />
        </picture>
        <AuthRouter />
      </main>
      <AuthFooter />
    </Layout>
  );
}
