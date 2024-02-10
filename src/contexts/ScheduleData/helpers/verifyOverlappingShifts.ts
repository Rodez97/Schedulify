import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import duration from "dayjs/plugin/duration.js";
import {areIntervalsOverlapping} from "date-fns";
import {type Shift} from "../../../types/Shift";
import {getShiftDayjsDate} from "../../../types/helpers";
dayjs.extend(isoWeek);
dayjs.extend(duration);

/**
 * Check if a new shift start or end time overlaps with an existing shift
 * @param start - The start time of the new shift
 * @param end - The end time of the new shift
 * @param shiftId - The id of the shift to ignore
 */
export function checkForOverlappingShifts(
  weekEmployeeShifts: Shift[] | undefined,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  shiftId: string,
): boolean {
  // Check if there are any shifts
  if (weekEmployeeShifts?.length == null) {
    return false;
  }

  // Check if the new shift start or end time overlaps with an existing shift
  return weekEmployeeShifts.some(shift => {
    // Check if the shift is the same shift
    if (shift.id === shiftId) {
      return false;
    }

    const shiftStart = getShiftDayjsDate(shift, "start");
    const shiftEnd = getShiftDayjsDate(shift, "end");

    return areIntervalsOverlapping(
      {start: start.toDate(), end: end.toDate()},
      {
        start: shiftStart.toDate(),
        end: shiftEnd.toDate(),
      },
    );
  });
}

export function checkForOverlappingShiftsARRAY(
  shifts: Shift[],
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  shiftId: string,
): boolean {
  // Check if there are any shifts
  if (shifts.length === 0) {
    return false;
  }

  // Check if the new shift start or end time overlaps with an existing shift
  return shifts.some(shift => {
    // Check if the shift is the same shift
    if (shiftId === shift.id) {
      return false;
    }

    const shiftStart = getShiftDayjsDate(shift, "start");
    const shiftEnd = getShiftDayjsDate(shift, "end");

    return areIntervalsOverlapping(
      {start: start.toDate(), end: end.toDate()},
      {
        start: shiftStart.toDate(),
        end: shiftEnd.toDate(),
      },
    );
  });
}
