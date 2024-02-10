import {createContext} from "react";
import {type Shift} from "../../types/Shift";
import {type MemberShifts} from "./useScheduleData";
import {type Dayjs} from "dayjs";
import {type WeekSchedule} from "../../types/WeekSchedule";
import type Member from "../../types/Member";

export interface ScheduleContextProps {
  weekId: string;
  setWeekId: React.Dispatch<React.SetStateAction<string>>;
  shifts: Shift[];
  memberShifts: MemberShifts[];
  weekDays: Dayjs[];
  loading: boolean;
  error?: Error | undefined;
  weekSchedule?: WeekSchedule | undefined;
  openNewShiftDialog: (member: Member, date: Dayjs) => void;
  openEditShiftDialog: (member: Member, shift: Shift) => void;
  openAddMemberDialog: () => void;
  openEditMemberDialog: (member: Member) => void;
}

export const ScheduleContext = createContext<ScheduleContextProps>({
  weekId: "",
  setWeekId: () => {},
  shifts: [],
  memberShifts: [],
  weekDays: [],
  loading: false,
  openNewShiftDialog: () => {},
  openEditShiftDialog: () => {},
  openAddMemberDialog: () => {},
  openEditMemberDialog: () => {},
});
