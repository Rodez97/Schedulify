import {
  doc,
  serverTimestamp,
  writeBatch,
  query,
  collection,
  where,
  getDocs,
  type WithFieldValue,
} from "firebase/firestore";
import {FIRESTORE} from "../../../firebase";
import dayjs from "dayjs";
import {nanoid} from "nanoid";
import {generateOrderFactor, getShiftDayjsDate} from "../../../types/helpers";
import {useSchedule} from "../useSchedule";
import {parseWeekId} from "../helpers";
import {shiftConverter} from "../helpers/FirestoreConverters";
import {type Shift, ShiftDate} from "../../../types/Shift";

function useCloneWeek() {
  const {shifts, weekDays, weekId} = useSchedule();

  const cloneWeek = async (targetWeekId: string, employees: string[]) => {
    if (employees.length === 0) {
      console.info(
        "%c No employees selected ",
        "font-size: 1.5rem; font-weight: 600; color: purple;",
      );
      return;
    }

    const originalShifts = shifts;
    if (originalShifts.length > 0) {
      throw new Error("Cannot clone shifts from a week with published shifts");
    }

    const {start} = parseWeekId(targetWeekId);

    // Calculate the number of weeks difference between the first day of the target week and the first day of the current week
    const weeksDiff = Math.abs(dayjs(start).diff(weekDays[0], "weeks"));

    // Get the shifts for the target week for the given employees
    const allQueries = query(
      collection(FIRESTORE, "shifts"),
      where("weekId", "==", targetWeekId),
      where("locationId", "==", 1),
    ).withConverter(shiftConverter);

    const exeQueries = await getDocs(allQueries);

    if (exeQueries.empty || exeQueries.size === 0) {
      console.info(
        "%c No shifts available to clone ",
        "font-size: 1.5rem; font-weight: 600; color: purple;",
      );
      return;
    }

    const shiftsArray: Shift[] = exeQueries.docs.map(doc => doc.data());

    // Create a record of shifts to update
    const updateBatch = writeBatch(FIRESTORE);

    const updatedAt = serverTimestamp();

    // Loop through each shift
    shiftsArray.forEach(shift => {
      const newId = nanoid();
      const shiftRef = doc(FIRESTORE, "shifts", newId).withConverter(
        shiftConverter,
      );
      // Adjust the shift to the current week
      const newStart = getShiftDayjsDate(shift, "start").add(
        weeksDiff,
        "weeks",
      );
      const newEnd = getShiftDayjsDate(shift, "end").add(weeksDiff, "weeks");
      const newShift: WithFieldValue<Shift> = {
        ...shift,
        id: newId,
        start: ShiftDate.toString(newStart.toDate()),
        end: ShiftDate.toString(newEnd.toDate()),
        updatedAt,
        weekId,
        weekOrderFactor: generateOrderFactor(weekId),
      };
      updateBatch.set(shiftRef, newShift);
    });

    try {
      await updateBatch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return cloneWeek;
}

export default useCloneWeek;
