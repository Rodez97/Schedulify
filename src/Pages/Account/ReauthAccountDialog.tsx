import {Alert, Form, Input, Modal} from "antd/es";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  sensitiveAction: () => Promise<void>;
  title: string;
  description: string;
  actionText: string;
}

function ReauthAccountDialog({
  open,
  onClose,
  sensitiveAction,
  title,
  description,
  actionText,
}: Props) {
  const [form] = Form.useForm();
  const {t} = useTranslation();
  const {user} = useMainUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onFinish = async ({password}: {password: string}) => {
    if (user.email == null) {
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await sensitiveAction();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      } else if (!(error instanceof Error)) {
        console.log({error});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={title}
      confirmLoading={loading}
      open={open}
      onOk={form.submit}
      onCancel={onClose}
      okButtonProps={{
        disabled: loading,
      }}
      okText={actionText}>
      <Alert message={description} type="warning" />
      <Form
        layout="vertical"
        initialValues={{password: ""}}
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        disabled={loading}
        css={{marginTop: 16}}>
        <Form.Item
          name="password"
          rules={[{required: true, message: t("field.required")}]}>
          <Input.Password placeholder={t("password")} />
        </Form.Item>
      </Form>

      {error != null && <Alert message={error.message} type="error" showIcon />}
    </Modal>
  );
}

export default ReauthAccountDialog;
