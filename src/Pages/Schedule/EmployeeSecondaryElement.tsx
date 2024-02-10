import {Tag} from "antd/es";
import {minutesToTextDuration} from "../../contexts/ScheduleData/helpers";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
import {getMemberHours} from "../../utils/memberUtils";

function useEmployeeWeekHours(employeeId: string) {
  const {shifts} = useSchedule();
  return getMemberHours(employeeId, shifts);
}

const EmployeeSecondaryElement = ({employeeId}: {employeeId: string}) => {
  const totalHours = useEmployeeWeekHours(employeeId);

  return (
    <div>
      <Tag color="processing">{minutesToTextDuration(totalHours * 60)}</Tag>
    </div>
  );
};

export default EmployeeSecondaryElement;
