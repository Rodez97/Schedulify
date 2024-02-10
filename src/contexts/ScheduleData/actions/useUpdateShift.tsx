import {type Shift, type PrimaryShiftData} from "../../../types/Shift";
import {
  type PartialWithFieldValue,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {FIRESTORE} from "../../../firebase";
import {useSelectedTeam} from "../../SelectedTeam/useSelectedTeam";
import {shiftConverter} from "../helpers/FirestoreConverters";

function useUpdateShift() {
  const {schedule} = useSelectedTeam();

  const updateShift = async (
    shift: Shift,
    pendingUpdate: Partial<PrimaryShiftData>,
  ) => {
    try {
      const shiftRef = doc(
        FIRESTORE,
        "schedules",
        schedule.id,
        "shifts",
        shift.id,
      ).withConverter(shiftConverter);
      const updatedAt = serverTimestamp();
      const updates: PartialWithFieldValue<Shift> = {
        updatedAt,
        ...pendingUpdate,
      };

      await setDoc(shiftRef, updates, {merge: true});
    } catch (error) {
      console.log(error);
    }
  };

  return updateShift;
}

export default useUpdateShift;
