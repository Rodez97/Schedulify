import {deleteDoc, doc} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import {Popconfirm, Space, Typography} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmarkCircle} from "@fortawesome/free-solid-svg-icons";
import {Colors} from "../../utils/Colors";
import {useTranslation} from "react-i18next";
import Table, {type ColumnsType} from "antd/es/table";
import {useMemo} from "react";
import {type CollaboratorRequest} from "./CollaboratorRequest";

function Invitations({
  remainingInvitations,
  collaboratorRequests,
}: {
  remainingInvitations: number;
  collaboratorRequests: CollaboratorRequest[] | undefined;
}) {
  const {t} = useTranslation();

  const removeInvitation = async (invitation: CollaboratorRequest) => {
    const requestRef = doc(FIRESTORE, "collaboratorRequests", invitation.id);

    try {
      await deleteDoc(requestRef);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnsType<CollaboratorRequest> = useMemo(
    () => [
      {
        title: t("email"),
        dataIndex: "email",
        key: "email",
      },
      {
        title: t("status"),
        dataIndex: "status",
        key: "status",
        render: (_, {status}) => {
          switch (status) {
            case "pending":
              return (
                <Typography.Text type="warning">{t("pending")}</Typography.Text>
              );
            case "accepted":
              return (
                <Typography.Text type="success">
                  {t("accepted")}
                </Typography.Text>
              );
            case "rejected":
              return (
                <Typography.Text type="danger">{t("rejected")}</Typography.Text>
              );
            default:
              return null;
          }
        },
      },
      {
        title: t("createdAt"),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_, {createdAt}) => {
          const date = createdAt?.toDate();
          return (
            <Typography.Text>
              {date?.toLocaleDateString()} {date?.toLocaleTimeString()}
            </Typography.Text>
          );
        },
      },
      {
        title: t("action"),
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Popconfirm
              title={t("remove.invitation.title")}
              description={t("remove.invitation.description")}
              onConfirm={() => {
                void removeInvitation(record);
              }}
              okText={t("yes")}
              cancelText={t("no")}>
              <FontAwesomeIcon
                icon={faXmarkCircle}
                color={Colors.Error.errorMain}
                size="lg"
                css={{cursor: "pointer"}}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [t],
  );

  return (
    <div style={{display: "flex", flexDirection: "column", padding: "0 20px"}}>
      <Typography.Title level={5}>
        {t("invitations.remaining {{0}}", {
          0: remainingInvitations,
        })}
      </Typography.Title>
      <Table columns={columns} dataSource={collaboratorRequests} />
    </div>
  );
}

export default Invitations;
