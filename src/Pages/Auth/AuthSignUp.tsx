import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Checkbox, Form, Input, Typography} from "antd/es";
import {useState} from "react";
import {
  type AuthError,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {AUTH} from "../../firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {errorTypeGuard} from "../../utils/analyticsHelpers";
import userSignUpConversion from "../../utils/userSignUpConversion";
import {useMainUserRaw} from "../../contexts/MainUser/useMainUser";

const AuthSignUp = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AuthError>();
  const {createFirstSchedule} = useMainUserRaw();

  const onFinish = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
    acceptTerms: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const newUser = await createUserWithEmailAndPassword(
        AUTH,
        email,
        password,
      );

      const scheduleId = await createFirstSchedule(newUser.user.uid);

      navigate(`/schedule/${scheduleId}`, {replace: true});

      userSignUpConversion();
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

  const googleSignUp = async () => {
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const newUser = await signInWithPopup(AUTH, provider);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isNewUser: boolean = (newUser as any)._tokenResponse.isNewUser;

      if (isNewUser) {
        const scheduleId = await createFirstSchedule(newUser.user.uid);
        navigate(`/schedule/${scheduleId}`, {replace: true});
        userSignUpConversion();
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
        {t("btn.signUp")}
      </Typography.Title>
      <Form
        disabled={isSubmitting}
        onFinish={(data: {
          email: string;
          password: string;
          acceptTerms: boolean;
        }) => {
          void onFinish(data);
        }}
        initialValues={{acceptTerms: false}}>
        <Form.Item
          required
          name="email"
          normalize={(value: string) => value?.toLowerCase()}
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
            {
              pattern: /[0-9]/,
              message: t("signUp.password.one.number"),
            },
            {
              pattern: /[a-z]/,
              message: t("signUp.password.upper.lower"),
            },
            {
              pattern: /[A-Z]/,
              message: t("signUp.password.upper.lower"),
            },
            // min 8 characters
            {
              min: 8,
              message: t("field.characters.limit.min {{0}}", {0: 8}),
            },
          ]}>
          <Input.Password placeholder={t("password")} showCount />
        </Form.Item>
        <Form.Item
          required
          valuePropName="checked"
          name="acceptTerms"
          rules={[
            {
              // eslint-disable-next-line @typescript-eslint/promise-function-async
              validator(_, value) {
                if (value === false) {
                  return Promise.reject(new Error(t("signUp.accept.terms")));
                }
                return Promise.resolve();
              },
            },
          ]}>
          <Checkbox>
            <Typography.Link
              href="https://schedulify.pro/terms-of-service/"
              target="_blank">
              {t("signUp.accept.terms.checkbox")}
            </Typography.Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button block htmlType="submit" loading={isSubmitting} type="primary">
            {t("btn.signUp")}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            block
            htmlType="button"
            loading={isSubmitting}
            onClick={() => {
              void googleSignUp();
            }}
            icon={<FontAwesomeIcon icon={faGoogle} />}>
            {t("btn.signUp.google")}
          </Button>
        </Form.Item>

        <Form.Item className="authView__centerFormItem">
          <Typography.Link
            onClick={() => {
              navigate("/login");
            }}
            strong>
            {t("btn.have.account")}
          </Typography.Link>
        </Form.Item>
      </Form>
      {error != null && (
        <Alert
          message="Error"
          description={t(error.code)}
          type="error"
          showIcon
        />
      )}
    </section>
  );
};

export default AuthSignUp;
