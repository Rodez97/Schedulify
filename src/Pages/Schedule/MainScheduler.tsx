/* eslint-disable @typescript-eslint/promise-function-async */
import {Navigate, Route, Routes} from "react-router-dom";
import {lazy} from "react";
import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import {WeekScheduleProvider} from "../../contexts/ScheduleData/ScheduleProvider";

const Scheduler = lazy(() => import("./Scheduler"));
const RosterView = lazy(() => import("./RosterView"));
const Collaborators = lazy(() => import("../Collaborators/Collaborators"));

export default function MainScheduler() {
  const {isOwner} = useSelectedTeam();

  return (
    <WeekScheduleProvider>
      <Routes>
        <Route path="/" element={<Scheduler />} />
        {isOwner && <Route path="/collaborators" element={<Collaborators />} />}
        <Route path="/roster" element={<RosterView />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </WeekScheduleProvider>
  );
}
