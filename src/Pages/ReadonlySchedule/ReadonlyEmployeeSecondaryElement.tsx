import {useMemo} from "react";
import {Tag} from "antd/es";
import {getShiftDuration} from "../../types/helpers";
import {type Shift} from "../../types/Shift";
import {minutesToTextDuration} from "../../contexts/ScheduleData/helpers";

function calculateTotalHours(memShifts: Shift[]) {
  return memShifts.reduce((acc, shift) => {
    const totalShiftHours = getShiftDuration(shift).totalHours;
    return acc + totalShiftHours;
  }, 0);
}

const ReadonlyEmployeeSecondaryElement = ({
  memShifts,
}: {
  memShifts?: Shift[];
}) => {
  const summaryText = useMemo(() => {
    if (memShifts == null) {
      return `0h 0min`;
    }

    const totalHours = calculateTotalHours(memShifts);

    const totalTime =
      totalHours !== 0 ? minutesToTextDuration(totalHours * 60) : "0h 0min";

    return totalTime;
  }, [memShifts]);

  return (
    <div>
      <Tag color="processing">{summaryText}</Tag>
    </div>
  );
};

export default ReadonlyEmployeeSecondaryElement;
