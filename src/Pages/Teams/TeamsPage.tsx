import {useTranslation} from "react-i18next";
import {Button, Empty, Layout} from "antd/es";
import {PageHeader} from "@ant-design/pro-layout";
import {useRef} from "react";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import MyTeams from "./MyTeams";
import LoadingPage from "../../shared/molecules/LoadingPage";
import ManageScheduleModal, {type ManageTeamRef} from "./ManageTeamModal";
import type Team from "../../types/Team";
import {ScheduleConverter} from "../../types/Team";
import {FIRESTORE} from "../../firebase";
import {and, collection, or, query, where} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import PageError from "../../shared/molecules/PageError";

const {Content} = Layout;

export default function TeamsPage() {
  const {t} = useTranslation();
  const {user} = useMainUser();
  const manageScheduleRef = useRef<ManageTeamRef>(null);
  const [schedules, loading, error] = useCollectionData<Team>(
    query(
      collection(FIRESTORE, "schedules"),
      or(
        where("ownerId", "==", user.uid),
        where(`collaborators`, "array-contains", user.uid),
        and(
          where("members", "array-contains", user.email),
          where("tier", "==", "premium"),
        ),
      ),
    ).withConverter(ScheduleConverter),
  );

  const handleEditSchedule = (schedule: Team) => {
    manageScheduleRef.current?.editTeam(schedule);
  };

  const handleNewSchedule = () => {
    manageScheduleRef.current?.newTeam();
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error != null) {
    return <PageError error={error} />;
  }

  return (
    <Layout css={{overflow: "auto", width: "100vw", height: "100vh", flex: 1}}>
      <PageHeader
        backIcon={false}
        title={t("mySchedules")}
        extra={
          <Button key="0" type="primary" onClick={handleNewSchedule}>
            {t("schedule.new")}
          </Button>
        }
      />

      <Content css={{padding: "5px 10px", overflow: "auto"}}>
        {schedules != null && schedules.length > 0 ? (
          <MyTeams onEdit={handleEditSchedule} teams={schedules} />
        ) : (
          <Empty
            description={t("no.schedules")}
            css={{
              marginTop: 50,
              marginBottom: 50,
              marginLeft: "auto",
              marginRight: "auto",
              display: "block",
            }}
          />
        )}
      </Content>

      <ManageScheduleModal ref={manageScheduleRef} />
    </Layout>
  );
}
