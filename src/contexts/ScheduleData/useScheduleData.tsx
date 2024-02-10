import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import type Member from "../../types/Member";
import {type Shift} from "../../types/Shift";
import {useSelectedTeam} from "../SelectedTeam/useSelectedTeam";
import {
  type WeekSchedule,
  WeekScheduleConverter,
} from "../../types/WeekSchedule";
import {FIRESTORE} from "../../firebase";
import {createDefaultScheduleDoc, getEmployeeAndShifts} from "./helpers";
import {collection, doc, query, where} from "firebase/firestore";
import {shiftConverter} from "./helpers/FirestoreConverters";
import {useMemo} from "react";

export interface MemberShifts {
  member: Member;
  shifts: Shift[];
}

export function useScheduleData(weekId: string) {
  const {schedule, members} = useSelectedTeam();
  const [weekSchedule, loadingWeekSchedule, errorWeekSchedule] =
    useDocumentData<WeekSchedule>(
      doc(FIRESTORE, "schedules", schedule.id, "weeks", weekId).withConverter(
        WeekScheduleConverter,
      ),
      {
        initialValue: createDefaultScheduleDoc(weekId),
      },
    );
  const [shifts, loading, error] = useCollectionData<Shift>(
    query(
      collection(FIRESTORE, "schedules", schedule.id, "shifts"),
      where("weekId", "==", weekId),
    ).withConverter(shiftConverter),
    {
      initialValue: [],
    },
  );

  const memberShifts = useMemo(() => {
    const shiftsSource = shifts ?? [];
    return getEmployeeAndShifts(members, shiftsSource);
  }, [members, shifts]);

  return {
    loading: loading ?? loadingWeekSchedule,
    error: error ?? errorWeekSchedule,
    shifts: shifts ?? [],
    memberShifts,
    weekSchedule,
  };
}
