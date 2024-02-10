import {type ModalProps, Modal, Form, Input, message} from "antd";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import {
  type WithFieldValue,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {nanoid} from "nanoid";
import {type CollaboratorRequest} from "./CollaboratorRequest";

interface FormType {
  email: string;
}

function InviteCollaborator({
  invitations,
  onClose,
  ...props
}: ModalProps & {
  invitations: CollaboratorRequest[];
  onClose: () => void;
}) {
  const {t} = useTranslation();
  const [form] = Form.useForm<FormType>();
  const {schedule, collaborators} = useSelectedTeam();
  const {user} = useMainUser();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({email}: FormType) => {
    const requestId = nanoid();

    const invitationRequest: WithFieldValue<CollaboratorRequest> = {
      id: requestId,
      scheduleId: schedule.id,
      email: email.trim(),
      status: "pending",
      createdAt: serverTimestamp(),
      name: schedule.name,
    };

    try {
      setLoading(true);
      const docRef = doc(FIRESTORE, "collaboratorRequests", requestId);
      await setDoc(docRef, invitationRequest);
      void message.success(t("invitation.sent"));
      form.resetFields();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      title={t("invite.modal.title")}
      cancelText={t("btn.cancel")}
      okText={t("invite.modal.btn")}
      confirmLoading={loading}
      onOk={() => {
        form.submit();
      }}>
      <Form<FormType>
        form={form}
        css={{minWidth: 280, maxWidth: 500, margin: "auto"}}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        autoComplete="off"
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}>
        <Form.Item
          label={t("email")}
          name="email"
          normalize={value => value?.toLowerCase().trim()}
          rules={[
            {required: true, message: t("field.required")},
            {type: "email", message: t("field.email.valid")},
            {
              whitespace: true,
              message: t("field.not.empty"),
            },
            // Prevent sending invitation to self
            {
              validator: async (_, value) => {
                if (value === user?.email) {
                  return await Promise.reject(
                    new Error(t("invite.self.error")),
                  );
                }
              },
            },
            // Prevent sending invitation to existing invited user
            {
              validator: async (_, value) => {
                if (
                  invitations.some(
                    invitation => invitation.email === value?.toLowerCase(),
                  )
                ) {
                  return await Promise.reject(
                    new Error(t("invite.already.invited")),
                  );
                }
              },
            },
            // Prevent sending invitation to existing collaborator
            {
              validator: async (_, value) => {
                if (
                  collaborators.some(
                    collab => collab.email === value?.toLowerCase(),
                  )
                ) {
                  return await Promise.reject(
                    new Error(t("invite.already.collaborator")),
                  );
                }
              },
            },
          ]}>
          <Input type="email" maxLength={255} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default InviteCollaborator;
