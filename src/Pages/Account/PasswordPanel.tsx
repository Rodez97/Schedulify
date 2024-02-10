import {Button, Card, message, Modal, Space} from "antd/es";
import {sendPasswordResetEmail} from "firebase/auth";
import {type ReactElement, useState} from "react";
import {useTranslation} from "react-i18next";
import {AUTH} from "../../firebase";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

function PasswordPanel(): ReactElement {
  const {t} = useTranslation();
  const {user} = useMainUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (): Promise<void> => {
    if (user.email == null) {
      void message.error(t("email.required.change.password"));
      return;
    }

    try {
      setIsSubmitting(true);
      // Send password reset email
      await sendPasswordResetEmail(AUTH, user.email);
      Modal.info({
        title: t("password.email.reset.sent.title"),
        content: t("password.email.reset.sent.description"),
      });
    } catch (error) {
      console.error(error);
      void message.error(t("password.email.reset.sent.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Space
      direction="vertical"
      css={{maxWidth: 500, minWidth: 300, width: "100%", marginBottom: 3}}>
      <Card title={t("password.reset.title")}>
        <Button
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          loading={isSubmitting}
          onClick={onFinish}
          type="primary"
          block>
          {t("password.reset.btn")}
        </Button>
      </Card>
    </Space>
  );
}

export default PasswordPanel;
