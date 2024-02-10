import {doc, writeBatch} from "firebase/firestore";
import {FIRESTORE} from "../../../firebase";
import {useSelectedTeam} from "../../SelectedTeam/useSelectedTeam";
import {type Dayjs} from "dayjs";
import createShiftElement from "../helpers/createShiftElement";
import {type Shift} from "../../../types/Shift";

function useCreateShift() {
  const {schedule} = useSelectedTeam();

  const createShift = async (
    shift: Shift,
    dates: Dayjs[],
    applyToWeekDays: number[],
  ) => {
    const newShifts = createShiftElement(shift, dates, applyToWeekDays);

    const batch = writeBatch(FIRESTORE);

    for (const shift of newShifts) {
      const shiftRef = doc(
        FIRESTORE,
        "schedules",
        schedule.id,
        "shifts",
        shift.id,
      );
      batch.set(shiftRef, shift);
    }

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return createShift;
}

export default useCreateShift;
