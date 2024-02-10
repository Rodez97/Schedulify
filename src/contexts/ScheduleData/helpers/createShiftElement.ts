import {type WithFieldValue, serverTimestamp} from "firebase/firestore";
import {nanoid} from "nanoid";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import {ShiftDate, type Shift} from "../../../types/Shift";
import {AUTH} from "../../../firebase";
import {generateOrderFactor} from "../../../types/helpers";
dayjs.extend(isoWeek);

export default function createShiftElement(
  shift: Shift,
  dates: dayjs.Dayjs[],
  applyToWeekDays: number[],
) {
  if (AUTH.currentUser == null) {
    throw new Error("User not authenticated");
  }

  const newShifts: Array<
    WithFieldValue<Shift> & {
      id: string;
    }
  > = [];

  const {start, end, ...rest} = shift;
  const baseStart = ShiftDate.toDate(start);
  const baseEnd = ShiftDate.toDate(end);
  for (const isoWeekDay of applyToWeekDays) {
    const shiftId = nanoid();
    const column = dates.find(c => c.isoWeekday() === isoWeekDay);

    if (column == null) {
      console.log("No column found for", isoWeekDay);
      continue;
    }

    const newStart = column.hour(baseStart.hour()).minute(baseStart.minute());
    const newEnd = column.hour(baseEnd.hour()).minute(baseEnd.minute());
    const normalizedEnd = newEnd.isBefore(newStart)
      ? newEnd.add(1, "day")
      : newEnd;
    newShifts.push({
      ...rest,
      start: ShiftDate.toString(newStart.toDate()),
      end: ShiftDate.toString(normalizedEnd.toDate()),
      updatedAt: serverTimestamp(),
      id: shiftId,
      weekOrderFactor: generateOrderFactor(rest.weekId),
    });
  }
  return newShifts;
}
