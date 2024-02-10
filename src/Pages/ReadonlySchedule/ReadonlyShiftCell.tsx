import dayjs from "dayjs";
import ReadonlyShiftElement from "./ReadonlyShiftElement";
import isoWeek from "dayjs/plugin/isoWeek";
import {useMemo} from "react";
import type Member from "../../types/Member";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSlash} from "@fortawesome/free-solid-svg-icons";
import {type Shift} from "../../types/Shift";
import {getShiftDayjsDate, getShiftIsoWeekday} from "../../types/helpers";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
dayjs.extend(isoWeek);

interface ReadonlyShiftCellProps {
  member: Member;
  allShifts?: Shift[];
  column: dayjs.Dayjs;
}

function ReadonlyShiftCell({
  member,
  allShifts,
  column,
}: ReadonlyShiftCellProps) {
  const {user} = useMainUser();
  const cellShifts = useMemo(() => {
    if (allShifts == null) {
      return [];
    }
    return allShifts
      .filter(s => getShiftIsoWeekday(s) === column.isoWeekday())
      .sort((a, b) => {
        const aStart = getShiftDayjsDate(a, "start");
        const bStart = getShiftDayjsDate(b, "start");
        if (aStart.isBefore(bStart)) return -1;
        if (aStart.isAfter(bStart)) return 1;
        return 0;
      });
  }, [allShifts, column]);

  return (
    <div
      className="shift-cell-container"
      style={{
        backgroundColor: user.email === member.email ? "#e6f7ff" : "white",
      }}>
      {cellShifts.length > 0 ? (
        cellShifts.map((shift, index) => (
          <ReadonlyShiftElement
            key={shift.id}
            {...{member, shift, column, index}}
          />
        ))
      ) : (
        <div className="shift-cell-container__add-shift">
          <FontAwesomeIcon icon={faSlash} />
        </div>
      )}
    </div>
  );
}

export default ReadonlyShiftCell;
