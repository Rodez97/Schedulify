import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import {useTranslation} from "react-i18next";
import {Popconfirm, Space, Table} from "antd";
import {ScheduleConverter} from "../../types/Team";
import {type Collaborator} from "../../types/Collaborator";
import {type ColumnsType} from "antd/es/table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmarkCircle} from "@fortawesome/free-solid-svg-icons";
import {Colors} from "../../utils/Colors";
import {arrayRemove, deleteField, doc, writeBatch} from "firebase/firestore";
import {FIRESTORE} from "../../firebase";
import {ScheduleMembershipConverter} from "../../types/ScheduleMembership";

function CollaboratorsList() {
  const {t} = useTranslation();
  const {schedule, collaborators} = useSelectedTeam();

  const removeCollaborator = async (collaborator: Collaborator) => {
    const batch = writeBatch(FIRESTORE);
    const docRef = doc(FIRESTORE, "schedules", schedule.id).withConverter(
      ScheduleConverter,
    );
    const membershipDocRef = doc(
      FIRESTORE,
      "scheduleMembership",
      schedule.id,
    ).withConverter(ScheduleMembershipConverter);

    batch.update(docRef, {
      collaborators: arrayRemove(collaborator.id),
    });

    batch.update(membershipDocRef, {
      [`collaborators.${collaborator.id}`]: deleteField(),
    });

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnsType<Collaborator> = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle" key={record.id}>
          <Popconfirm
            title={t("remove.invitation.title")}
            description={t("remove.invitation.description")}
            onConfirm={() => {
              void removeCollaborator(record);
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
  ];

  return (
    <div style={{display: "flex", flexDirection: "column", padding: 20}}>
      <Table columns={columns} dataSource={collaborators} />
    </div>
  );
}

export default CollaboratorsList;
