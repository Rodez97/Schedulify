import {EditFilled, SaveFilled, UserDeleteOutlined} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Typography,
} from "antd/es";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {useUpdateProfile} from "react-firebase-hooks/auth";
import {AUTH, FIRESTORE} from "../../firebase";
import {
  type MainUser,
  MainUserConverter,
} from "../../contexts/MainUser/MainUser";
import {doc, updateDoc} from "firebase/firestore";
import dayjs from "dayjs";
import Avatar from "react-avatar";
import {
  GoogleAuthProvider,
  deleteUser,
  fetchSignInMethodsForEmail,
  reauthenticateWithPopup,
} from "firebase/auth";
import ReauthAccountDialog from "./ReauthAccountDialog";

const languages = [
  {label: "Español", flag: "es", value: "es"},
  {label: "English", flag: "gb", value: "en"},
];

function ProfilePanel({userDocument}: {userDocument?: MainUser | undefined}) {
  const [form] = Form.useForm();
  const {t, i18n} = useTranslation();
  const [editing, setEditing] = useState(false);
  const {user} = useMainUser();
  const [updateProfile, updating] = useUpdateProfile(AUTH);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const cancelEditing = () => {
    setEditing(false);
    form.resetFields();
  };

  const onFinish = async ({
    displayName,
    language,
  }: {
    displayName: string;
    language: string;
  }) => {
    try {
      setLoading(true);
      const docRef = doc(FIRESTORE, "users", user.uid).withConverter(
        MainUserConverter,
      );
      await updateDoc(docRef, {displayName, language});

      // Change Language
      await i18n.changeLanguage(language);
      dayjs.locale(language);

      // Change Display Name
      const success = await updateProfile({displayName});

      if (success) {
        void message.success(t("profile.saved.success"));
        setEditing(false);
      } else {
        void message.error(t("profile.saved.error"));
      }
    } catch (error) {
      void message.error(t("profile.saved.error"));
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    if (user.email == null) return;
    try {
      // First, reauthenticate
      // Get the providers available for this email
      const providers = await fetchSignInMethodsForEmail(AUTH, user.email);

      // If there is password provider, reauthenticate with it
      if (providers.includes("password")) {
        setIsDialogOpen(true);
      } else {
        // If there is no password provider, reauthenticate with popup
        Modal.confirm({
          title: t("account.delete.title"),
          content: t("account.delete.description"),
          okText: t("btn.continue"),
          cancelText: t("btn.cancel"),
          onOk: async () => {
            try {
              const googleProvider = new GoogleAuthProvider();
              const credential = await reauthenticateWithPopup(
                user,
                googleProvider,
              );

              if (credential.user.uid !== user.uid) {
                void message.error(t("account.delete.error"));
                return;
              }
              await deleteUser(user);
              void message.success(t("account.delete.success"));
            } catch (error) {
              void message.error(t("account.delete.error"));
            }
          },
        });
      }
    } catch (error) {
      void message.error(t("account.delete.error"));
    }
  };

  return (
    <Space direction="vertical" css={{width: "100%", marginBottom: 3}}>
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
            <Avatar
              src={user.photoURL ?? undefined}
              alt={user.displayName ?? undefined}
              name={user.displayName ?? undefined}
              email={user.email ?? undefined}
              size="30"
            />
            <Typography.Text type="secondary">{user.email}</Typography.Text>
          </div>
        }>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            displayName: userDocument?.displayName ?? user.displayName,
            language: i18n.language,
          }}
          disabled={!editing || updating || loading}
          onFinish={onFinish}>
          <Form.Item
            label={t("field.fullName")}
            name="displayName"
            rules={[
              {required: true, message: ""},
              {
                max: 80,
                message: t("field.characters.limit {{0}}", {0: 80}),
              },
              {
                whitespace: true,
                message: t("field.not.empty"),
              },
            ]}>
            <Input maxLength={20} showCount />
          </Form.Item>

          <Form.Item label={t("language")} name="language">
            <Select options={languages} id="lang-select" />
          </Form.Item>
        </Form>
        <Space
          css={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}>
          {editing && (
            <Button onClick={cancelEditing} disabled={updating || loading}>
              {t("btn.cancel")}
            </Button>
          )}
          {editing ? (
            <Button
              icon={<SaveFilled />}
              loading={updating || loading}
              onClick={form.submit}
              type="primary">
              {t("btn.save")}
            </Button>
          ) : (
            <Button
              icon={<EditFilled />}
              loading={updating || loading}
              onClick={() => {
                setEditing(true);
              }}
              type="link"
              disabled={false}>
              {t("btn.edit")}
            </Button>
          )}
        </Space>

        <Button
          size="large"
          color="error"
          css={{
            minWidth: 270,
            margin: "50px auto",
            display: "block",
          }}
          onClick={onDeleteAccount}
          icon={<UserDeleteOutlined />}
          danger
          type="primary">
          {t("account.delete.btn")}
        </Button>
      </Card>

      <ReauthAccountDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        title={t("account.delete.title")}
        description={t("account.delete.description")}
        actionText={t("account.delete.btn")}
        sensitiveAction={async () => {
          await deleteUser(user);
        }}
      />
    </Space>
  );
}

export default ProfilePanel;
