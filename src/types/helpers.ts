import dayjs, {type Dayjs} from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import {type Shift} from "./Shift";
import {SHIFTFORMAT} from "../utils/constants";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

/**
 * The format for displaying availability time, using hour:minute AM/PM format.
 */
export const AVAILABILITY_TIME_FORMAT = "h:mm A" as const;

export function getShiftDuration(shift: Shift): {
  totalHours: number;
  totalMinutes: number;
} {
  const totalMinutes = getShiftDayjsDate(shift, "end").diff(
    getShiftDayjsDate(shift, "start"),
    "minutes",
  );
  const totalHours = totalMinutes / 60;
  return {totalHours, totalMinutes};
}

export function getShiftIsoWeekday(shift: Shift): number {
  return getShiftDayjsDate(shift, "start").isoWeekday();
}

export function getShiftDayjsDate(shift: Shift, date: "start" | "end"): Dayjs {
  return dayjs(shift[date], SHIFTFORMAT);
}

export function generateOrderFactor(weekId: string) {
  const [week, year] = weekId.split("-").slice(1).map(Number);
  // Convert the week number to decimal (e.g. 0.01 for week 1, 0.10 for week 10, 0.52 for week 52)
  const weekDecimal = week / 100;
  // Add the year to the week decimal (e.g. 2020.01 for week 1 of 2020, 2020.10 for week 10 of 2020, 2020.52 for week 52 of 2020)
  const yearDecimal = year + weekDecimal;
  return yearDecimal;
}
