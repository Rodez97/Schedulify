import {doc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import type Team from "../../types/Team";
import {ScheduleConverter} from "../../types/Team";
import {FIRESTORE} from "../../firebase";
import {
  type ScheduleMembership,
  ScheduleMembershipConverter,
} from "../../types/ScheduleMembership";

export function useSelectedTeamData(scheduleId: string) {
  const [schedule, loading, error] = useDocumentData<Team>(
    doc(FIRESTORE, "schedules", scheduleId).withConverter(ScheduleConverter),
  );
  const [
    scheduleMembership,
    loadingScheduleMembership,
    errorScheduleMembership,
  ] = useDocumentData<ScheduleMembership>(
    doc(FIRESTORE, "scheduleMembership", scheduleId).withConverter(
      ScheduleMembershipConverter,
    ),
  );

  return {
    loading: loading || loadingScheduleMembership,
    error: error ?? errorScheduleMembership,
    schedule,
    scheduleMembership,
  };
}
