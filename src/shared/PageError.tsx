import {Button, Result} from "antd/es";
import {type FirebaseError} from "firebase/app";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

function ErrorPage({error}: {error: FirebaseError | Error}) {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      css={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
      status="error"
      title={t("error.page.title")}
      subTitle={t(error.message)}
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/");
          }}>
          {t("error.404.btn")}
        </Button>
      }
    />
  );
}

export default ErrorPage;
