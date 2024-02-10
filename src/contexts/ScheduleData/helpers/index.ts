import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import {setISOWeek, setYear} from "date-fns";
import {type Shift, type WeekInfo} from "../../../types/Shift";
import {generateOrderFactor, getShiftDuration} from "../../../types/helpers";
import type Member from "../../../types/Member";
import {type MemberShifts} from "../useScheduleData";
import {type WeekSchedule} from "../../../types/WeekSchedule";
import {Timestamp} from "firebase/firestore";
dayjs.extend(isoWeek);

export function weekToDate(year: number, isoWeekNo: number): dayjs.Dayjs {
  if (year < 1970 || year > 2038) {
    throw new Error("Invalid year");
  }

  if (isoWeekNo < 1 || isoWeekNo > 53) {
    throw new Error("Invalid week number");
  }

  const baseDate = new Date();
  const fixedYear = setYear(baseDate, year);
  const fixedWeek = setISOWeek(fixedYear, isoWeekNo);

  return dayjs(fixedWeek).startOf("isoWeek");
}

export function parseWeekId(weekId: string): WeekInfo {
  const [week, year] = weekId.split("-").slice(1).map(Number);
  const start = weekToDate(year, week);
  const end = start.endOf("isoWeek");
  return {year, week, start, end};
}

export function getWeekFullNumberByDate(date: dayjs.Dayjs): number {
  const weekNumber = date.isoWeek() / 100;
  const year = date.year();
  return year + weekNumber;
}

export function minutesToTextDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return "0h 0min";
  }
  const hours = Math.floor(totalMinutes / 60);
  let minutes: string | number = totalMinutes % 60;
  minutes = minutes.toFixed(0);
  return `${hours}h ${minutes}min`;
}

export const getWeekDays = (weekId: string): dayjs.Dayjs[] => {
  const {start: weekStart} = parseWeekId(weekId);
  const weekDays: dayjs.Dayjs[] = [];

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const day = weekStart.add(dayIndex, "day");
    if (day.isSame(weekStart, "isoWeek")) {
      weekDays.push(day);
    }
  }

  return weekDays;
};

export const getMemberHours = (employeeId: string, shifts: Shift[]) => {
  if (shifts.length == null) {
    return 0;
  }
  const employeeShifts = shifts.filter(shift => shift.memberId === employeeId);
  return employeeShifts.reduce((acc, shift) => {
    return acc + getShiftDuration(shift).totalHours;
  }, 0);
};

export const getTotalWeekSummary = (shifts: Shift[]) => {
  const total = {
    totalHours: shifts.reduce((acc, shift) => {
      return acc + getShiftDuration(shift).totalHours;
    }, 0),
    totalPeople: new Set(shifts.map(shift => shift.memberId)).size,
    totalShifts: shifts.length,
  };

  return total;
};

export const calculateTotalHoursByShifts = (shifts: Shift[]) => {
  return shifts.reduce((acc, shift) => {
    return acc + getShiftDuration(shift).totalHours;
  }, 0);
};

export const getEmployeeAndShifts = (
  members: Member[],
  shifts: Shift[],
): MemberShifts[] =>
  members.map(member => ({
    member,
    shifts: shifts.filter(s => s.memberId === member.id),
  }));

export function getScheduleWeekStart(year: number, weekNumber: number): Date {
  const firstDayWeek = weekToDate(year, weekNumber);
  return firstDayWeek.toDate();
}

export function createDefaultScheduleDoc(weekId: string): WeekSchedule {
  const {week, year} = parseWeekId(weekId);
  return {
    id: "",
    year,
    weekNumber: week,
    createdAt: Timestamp.now(),
    weekId,
    weekOrderFactor: generateOrderFactor(weekId),
  };
}
