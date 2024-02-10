import dayjs, {type Dayjs} from "dayjs";
import {type Timestamp} from "firebase/firestore";
import {SHIFTFORMAT} from "../utils/constants";

export interface WeekInfo {
  year: number;

  week: number;

  start: Dayjs;

  end: Dayjs;
}

export interface PrimaryShiftData {
  start: string;

  end: string;

  position?: string;

  notes?: string;
}

export interface Shift extends PrimaryShiftData {
  id: string;
  updatedAt: Timestamp;
  weekId: string;
  memberId: string;
  weekOrderFactor: number;
}

export const ShiftDate = {
  toDate(date: string): Dayjs {
    return dayjs(date, SHIFTFORMAT);
  },

  toString(date: Date): string {
    return dayjs(date).format(SHIFTFORMAT);
  },
};
