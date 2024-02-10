import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Form, Input, Typography} from "antd/es";
import {
  type AuthError,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {AUTH} from "../../firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {errorTypeGuard} from "../../utils/analyticsHelpers";
import userSignUpConversion from "../../utils/userSignUpConversion";
import {useMainUserRaw} from "../../contexts/MainUser/useMainUser";

const AuthLogin = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AuthError>();
  const {createFirstSchedule} = useMainUserRaw();

  const onFinish = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(AUTH, email, password);
      navigate(`/`, {replace: true});
    } catch (error) {
      if (errorTypeGuard<AuthError>(error, "code")) {
        setError(error);
      } else {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(AUTH, provider);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isNewUser: boolean = (user as any)._tokenResponse.isNewUser;

      if (isNewUser) {
        const scheduleId = await createFirstSchedule(user.user.uid);
        navigate(`/schedule/${scheduleId}`, {replace: true});
        userSignUpConversion();
      } else {
        navigate(`/`, {replace: true});
      }
    } catch (error) {
      if (errorTypeGuard<AuthError>(error, "code")) {
        setError(error);
      } else {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="authView">
      <Typography.Title level={4} className="authView__title">
        {t("login.title")}
      </Typography.Title>
      <Form
        disabled={isSubmitting}
        onFinish={(data: {email: string; password: string}) => {
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
        <Form.Item
          required
          name="password"
          rules={[
            {
              required: true,
              message: "",
            },
          ]}>
          <Input.Password placeholder={t("password")} />
        </Form.Item>
        <Form.Item>
          <Typography.Link
            onClick={() => {
              navigate("/forgot-password");
            }}
            className="authView__right">
            {t("btn.forgot.password")}
          </Typography.Link>
        </Form.Item>

        <Form.Item>
          <Button block htmlType="submit" loading={isSubmitting} type="primary">
            {t("btn.signIn")}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            block
            htmlType="button"
            loading={isSubmitting}
            onClick={() => {
              void googleSignIn();
            }}
            icon={<FontAwesomeIcon icon={faGoogle} />}>
            {t("btn.signIn.google")}
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
          description={t(error.code)}
          type="error"
          showIcon
          closable
        />
      )}
    </section>
  );
};

export default AuthLogin;
