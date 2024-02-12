import {useTranslation} from "react-i18next";
import PasswordPanel from "./PasswordPanel";
import ProfilePanel from "./ProfilePanel";
import {Layout, Tabs} from "antd/es";
import GrayPageHeader from "../../shared/GrayPageHeader";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {doc} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {MainUserConverter} from "../../contexts/MainUser/MainUser";
import LoadingPage from "../../shared/LoadingPage";
import ErrorPage from "../../shared/PageError";

function Account() {
  const {t} = useTranslation();
  const {user} = useMainUser();
  const [userDocument, loading, error] = useDocumentData(
    doc(FIRESTORE, "users", user.uid).withConverter(MainUserConverter),
  );

  if (loading) {
    return <LoadingPage />;
  }

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  return (
    <Layout>
      <GrayPageHeader title={t("account.details")} />
      <Layout.Content
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 20,
        }}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: t("account.basic"),
              children: <ProfilePanel userDocument={userDocument} />,
            },
            {
              key: "2",
              label: t("password"),
              children: <PasswordPanel />,
            },
          ]}
          centered
          css={{
            width: "100%",
            maxWidth: 500,
            minWidth: 300,
          }}
        />
      </Layout.Content>
    </Layout>
  );
}

export default Account;
