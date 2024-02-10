import {doc, deleteDoc} from "firebase/firestore";
import {FIRESTORE} from "../../../firebase";
import {useSelectedTeam} from "../../SelectedTeam/useSelectedTeam";
import {shiftConverter} from "../helpers/FirestoreConverters";
import {type Shift} from "../../../types/Shift";

function useDeleteShift() {
  const {schedule} = useSelectedTeam();

  const deleteShift = async (shift: Shift) => {
    try {
      const shiftRef = doc(
        FIRESTORE,
        "schedules",
        schedule.id,
        "shifts",
        shift.id,
      ).withConverter(shiftConverter);
      await deleteDoc(shiftRef);
    } catch (error) {
      console.log(error);
    }
  };

  return deleteShift;
}

export default useDeleteShift;
