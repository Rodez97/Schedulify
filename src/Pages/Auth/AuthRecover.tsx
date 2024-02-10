import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSendPasswordResetEmail} from "react-firebase-hooks/auth";
import {useCountdown, useSessionstorageState} from "rooks";
import {Alert, Button, Form, Input, message, Typography} from "antd/es";
import {AUTH} from "../../firebase";

const initialCounterTime = new Date();

function AuthRecover() {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(AUTH);
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [sentTime, setSentTime, clearSentTime] = useSessionstorageState(
    "recover-pass-email-sent-time",
    "",
  );
  const count = useCountdown(
    sentTime.length > 0 ? new Date(sentTime) : initialCounterTime,
    {
      interval: 1000,
      onEnd: () => {
        clearSentTime();
      },
    },
  );

  const onFinish = async ({email}: {email: string}) => {
    try {
      setSentTime(new Date(Date.now() + 60_000).toString());
      await sendPasswordResetEmail(email);
      void message.success(t("auth.recover.password.email.sent"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="authView">
      <Typography.Title level={4} className="authView__title">
        {t("auth.recover.password.btn")}
      </Typography.Title>
      <Form
        disabled={Boolean(count) || sending}
        onFinish={(data: {email: string}) => {
          void onFinish(data);
        }}>
        <Form.Item
          required
          name="email"
          rules={[
            {
              required: true,
              message: "",
            },
            {type: "email", message: t("field.email.valid")},
          ]}>
          <Input type="email" placeholder={t("email")} maxLength={255} />
        </Form.Item>
        <Form.Item className="authView__centerFormItem">
          <Typography.Link
            onClick={() => {
              navigate(-1);
            }}
            className="authView__right">
            {t("auth.back.login.btn")}
          </Typography.Link>
        </Form.Item>

        <Form.Item>
          <Button
            block
            htmlType="submit"
            loading={Boolean(count) || sending}
            type="primary">
            {count > 0 ? count : t("recover")}
          </Button>
        </Form.Item>

        <Form.Item className="authView__centerFormItem">
          <Typography.Link
            onClick={() => {
              navigate("/register");
            }}
            strong>
            {t("btn.no.account")}
          </Typography.Link>
        </Form.Item>
      </Form>
      {error != null && (
        <Alert
          message="Error"
          description={t(error.message)}
          type="error"
          showIcon
        />
      )}
    </section>
  );
}

export default AuthRecover;
