import {css} from "@emotion/react";
import {Button, Modal, Space} from "antd/es";
import axios from "axios";
import {useSendEmailVerification} from "react-firebase-hooks/auth";
import {useTranslation} from "react-i18next";
import {useCountdown, useSessionstorageState} from "rooks";
import {AUTH, FIREBASE_CONFIG} from "../../firebase";
import {useMainUser} from "../../contexts/MainUser/useMainUser";

const initialCounterTime = new Date();

function VerifyEmailBanner() {
  const {user} = useMainUser();
  const [sendEmailVerification, sending] = useSendEmailVerification(AUTH);
  const {t} = useTranslation();
  const [sentTime, setSentTime, clearSentTime] = useSessionstorageState(
    "verification-email-sent-time",
    "",
  );
  const count = useCountdown(
    sentTime != null ? new Date(sentTime) : initialCounterTime,
    {
      interval: 1000,
      onEnd: () => {
        clearSentTime();
      },
    },
  );

  const sendVerificationEmail = async () => {
    if (count > 0) {
      return;
    }
    try {
      setSentTime(new Date(Date.now() + 120_000).toString());
      await sendEmailVerification();
      Modal.success({
        title: t("email.verify.sent.title"),
        content: t("email.verify.sent.description"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = async () => {
    try {
      const idToken = await user.getIdToken(true);
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_CONFIG.apiKey}`,
        {idToken},
      );
      if (response.status !== 200) {
        alert("Error verifying email");
        return;
      }
      if (response.data?.users?.[0]?.emailVerified === true) {
        clearSentTime();
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      css={css`
        background-color: #e6f4ff;
        display: flex;
        flex-direction: row;
        margin-bottom: 0;
        border: 0 !important;
        border-radius: 0 !important;
        padding: 8px 12px;
        margin: 0;
        justify-content: space-between;
        @media (max-width: 575px) {
          flex-direction: column;
        }
      `}>
      <span
        css={css`
          @media (max-width: 575px) {
            text-align: center;
            margin-bottom: 8px;
          }
        `}>
        {t(
          "Verify Your Email Address, click the link in the email we sent you",
        )}
      </span>
      <Space
        wrap
        css={{
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Button
          size="small"
          type="dashed"
          onClick={sendVerificationEmail}
          disabled={Boolean(count)}
          loading={sending}>
          {count > 0 ? `${count}s` : t("email.verify.resend")}
        </Button>
        <Button size="small" type="primary" onClick={handleContinue} block>
          {t("email.verify.check")}
        </Button>
      </Space>
    </div>
  );
}

export default VerifyEmailBanner;
