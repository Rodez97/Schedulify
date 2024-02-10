import {useRef, type ReactNode} from "react";
import {useMemo, useState} from "react";
import dayjs, {type Dayjs} from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import {useScheduleData} from "./useScheduleData";
import {getWeekDays} from "./helpers";
import type Member from "../../types/Member";
import {useSelectedTeam} from "../SelectedTeam/useSelectedTeam";
import ManageMemberDrawer, {
  type ManageMemberDrawerRef,
} from "../../Pages/Schedule/ManageMemberDrawer";
import ManageShiftModal, {
  type ManageShiftModalRef,
} from "../../Pages/Schedule/Modals/ManageShiftModal";
import OverLimitModal from "../../Pages/Schedule/Modals/OverLimitModal";
import {type Shift} from "../../types/Shift";
import {WEEKFORMAT} from "../../utils/constants";
import {ScheduleContext} from "./ScheduleContext";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export function WeekScheduleProvider({children}: {children: ReactNode}) {
  const [weekId, setWeekId] = useState(dayjs().format(WEEKFORMAT));
  const {usage} = useSelectedTeam();
  const weekDays = useMemo(() => getWeekDays(weekId), [weekId]);
  const {shifts, weekSchedule, loading, error, memberShifts} =
    useScheduleData(weekId);
  const manageMemberDialogRef = useRef<ManageMemberDrawerRef>(null);
  const manageShiftDialogRef = useRef<ManageShiftModalRef>(null);
  const [overLimitDialogOpen, setOverLimitDialogOpen] = useState(false);

  const openNewShiftDialog = (member: Member, date: Dayjs) => {
    if (usage.overLimit) {
      setOverLimitDialogOpen(true);
      return;
    }

    manageShiftDialogRef.current?.openNew(member, date);
  };

  const openEditShiftDialog = (member: Member, shift: Shift) => {
    if (usage.overLimit) {
      setOverLimitDialogOpen(true);
      return;
    }

    manageShiftDialogRef.current?.openEdit(member, shift);
  };

  const openAddMemberDialog = () => {
    if (usage.overLimit) {
      setOverLimitDialogOpen(true);
      return;
    }

    manageMemberDialogRef.current?.openNew();
  };

  const openEditMemberDialog = (member: Member) => {
    if (usage.overLimit) {
      setOverLimitDialogOpen(true);
      return;
    }

    manageMemberDialogRef.current?.openEdit(member);
  };

  return (
    <ScheduleContext.Provider
      value={{
        weekId,
        setWeekId,
        weekDays,
        memberShifts,
        loading,
        error,
        shifts,
        weekSchedule,
        openNewShiftDialog,
        openEditShiftDialog,
        openAddMemberDialog,
        openEditMemberDialog,
      }}>
      {children}
      <ManageShiftModal ref={manageShiftDialogRef} />
      <ManageMemberDrawer ref={manageMemberDialogRef} />
      <OverLimitModal
        visible={overLimitDialogOpen}
        onClose={() => {
          setOverLimitDialogOpen(false);
        }}
      />
    </ScheduleContext.Provider>
  );
}
