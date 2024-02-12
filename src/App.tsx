import {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import ReadonlySchedule from "./Pages/ReadonlySchedule/ReadonlySchedule";
import {useMainUserRaw} from "./contexts/MainUser/useMainUser";
import LoadingPage from "./shared/LoadingPage";
import AuthPages from "./Pages/Auth";
import {Layout} from "antd";
import {MainHeader} from "./shared/MainHeader";
import TeamsPage from "./Pages/Teams/TeamsPage";
import Account from "./Pages/Account/Account";
import {SelectedTeamProvider} from "./contexts/SelectedTeam/SelectedTeamProvider";
import MainScheduler from "./Pages/Schedule/MainScheduler";
import {css} from "@emotion/react";
import useTrackPageAnalytics from "./hooks/useTrackPageAnalytics";

const {Content} = Layout;

function App() {
  const {user, loading} = useMainUserRaw();
  useTrackPageAnalytics();

  if (loading) {
    return <LoadingPage />;
  }

  if (user == null) {
    return <AuthPages />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <Layout>
        <MainHeader />

        <Layout>
          <Content
            css={css`
              overflow: auto;
              display: flex;
              flex-direction: column;
            `}>
            <Routes>
              <Route path="/" element={<TeamsPage />} />
              <Route path="account" element={<Account />} />
              <Route
                path="schedule/:scheduleId/*"
                element={
                  <SelectedTeamProvider>
                    <MainScheduler />
                  </SelectedTeamProvider>
                }
              />
              <Route
                path="viewSchedule/:readonlyScheduleId"
                element={<ReadonlySchedule />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Suspense>
  );
}

export default App;
