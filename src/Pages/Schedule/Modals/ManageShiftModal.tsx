import dayjs from "dayjs";
import {forwardRef, useImperativeHandle, useState} from "react";
import ShiftEditor, {type ShiftFormDataType} from "../ShiftEditorFormik";
import isoWeek from "dayjs/plugin/isoWeek";
import type Member from "../../../types/Member";
import {getShiftDayjsDate} from "../../../types/helpers";
import {type Shift} from "../../../types/Shift";
dayjs.extend(isoWeek);

export interface ManageShiftModalRef {
  openNew: (member: Member, date: dayjs.Dayjs) => void;
  openEdit: (member: Member, shift: Shift) => void;
}

interface State {
  isOpen: boolean;
  member: Member;
  shift?: Shift;
  date: dayjs.Dayjs;
}

const ManageShiftModal = forwardRef<ManageShiftModalRef, unknown>((_, ref) => {
  const [state, setState] = useState<State>();
  const [initialValues, setInitialValues] = useState<ShiftFormDataType>({
    applyTo: [],
    notes: "",
    position: "",
    start: dayjs(),
    end: dayjs(),
  });

  useImperativeHandle(ref, () => ({
    openNew: (member: Member, date: dayjs.Dayjs) => {
      const position =
        member.positions != null && member.positions.length === 1
          ? member.positions[0]
          : "";

      setInitialValues({
        applyTo: [date.isoWeekday()],
        start: date.add(8, "hours"),
        end: date.add(16, "hours"),
        notes: "",
        position,
      });
      setState({
        isOpen: true,
        member,
        date,
      });
    },
    openEdit: (member: Member, shift: Shift) => {
      const startDate = getShiftDayjsDate(shift, "start");
      const applyTo = [startDate.isoWeekday()];
      const notes = shift.notes;
      const position = shift.position;

      setInitialValues({
        applyTo,
        notes,
        position,
        start: startDate,
        end: getShiftDayjsDate(shift, "end"),
      });
      setState({
        isOpen: true,
        member,
        shift,
        date: startDate,
      });
    },
  }));

  const handleClose = () => {
    setState(undefined);
  };

  if (state == null) {
    return null;
  }

  return (
    <ShiftEditor
      {...state}
      onClose={handleClose}
      initialValues={initialValues}
    />
  );
});

ManageShiftModal.displayName = "ManageShiftDialog";

export default ManageShiftModal;
