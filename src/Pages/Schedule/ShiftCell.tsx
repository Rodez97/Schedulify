import dayjs, {type Dayjs} from "dayjs";
import ShiftElement from "./ShiftElement";
import {PlusOutlined} from "@ant-design/icons";
import isoWeek from "dayjs/plugin/isoWeek";
import {useMemo} from "react";
import type Member from "../../types/Member";
import {getShiftDayjsDate, getShiftIsoWeekday} from "../../types/helpers";
import {type Shift} from "../../types/Shift";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
dayjs.extend(isoWeek);

interface ShiftCellProps {
  member: Member;
  column: Dayjs;
  memberShifts: Shift[];
}

function ShiftCell({member, column, memberShifts}: ShiftCellProps) {
  const {openNewShiftDialog} = useSchedule();
  const handleCellClick = () => {
    openNewShiftDialog(member, column);
  };

  const cellShifts = useMemo(() => {
    return memberShifts
      .filter(s => getShiftIsoWeekday(s) === column.isoWeekday())
      .sort((a, b) => {
        const aStart = getShiftDayjsDate(a, "start");
        const bStart = getShiftDayjsDate(b, "start");
        if (aStart.isBefore(bStart)) return -1;
        if (aStart.isAfter(bStart)) return 1;
        return 0;
      });
  }, [memberShifts, column]);

  return (
    <div className="shift-cell-container">
      {cellShifts.length > 0 ? (
        cellShifts.map((shift, index) => (
          <ShiftElement key={shift.id} {...{member, shift, column, index}} />
        ))
      ) : (
        <div
          className="shift-cell-container__add-shift"
          onClick={handleCellClick}>
          <PlusOutlined />
        </div>
      )}
    </div>
  );
}

export default ShiftCell;
