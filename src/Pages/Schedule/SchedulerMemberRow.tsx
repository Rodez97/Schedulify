import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
import type Member from "../../types/Member";
import {type Shift} from "../../types/Shift";
import {SCHEDULE_VISIBILITY} from "../../utils/constants";
import EmpColumnCell from "./EmpColumnCell";
import ShiftCell from "./ShiftCell";
import styled from "@emotion/styled";

interface Props {
  member: Member;
  statusFilter: SCHEDULE_VISIBILITY;
  searchQuery: string;
}

const getShiftsByMember = (shifts: Shift[], memberId: string) => {
  return shifts.filter(shift => shift.memberId === memberId);
};

const getIfShouldShow = (
  shiftsLength: number,
  member: Member,
  statusFilter: string,
  searchQuery: string,
) => {
  const byStatus = statusFilter === SCHEDULE_VISIBILITY.ALL || shiftsLength > 0;

  if (searchQuery === "") return byStatus;

  const byName = member.displayName
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  if (byName) return byName;

  const positions = member.positions != null ? member.positions.join(" ") : "";

  const byPosition = positions !== "" && positions.includes(searchQuery);
  return byPosition;
};

function SchedulerMemberRow({member, statusFilter, searchQuery}: Props) {
  const {weekDays, shifts} = useSchedule();
  const memberShifts = getShiftsByMember(shifts, member.id);
  return (
    <SchedulerMemberTableRow
      visible={getIfShouldShow(
        memberShifts.length,
        member,
        statusFilter,
        searchQuery,
      )}>
      <th>
        <EmpColumnCell member={member} key={member.id} />
      </th>
      {weekDays.map((weekday, index) => {
        return (
          <td key={index}>
            <ShiftCell
              key={index}
              member={member}
              memberShifts={memberShifts}
              column={weekday}
            />
          </td>
        );
      })}
    </SchedulerMemberTableRow>
  );
}

export default SchedulerMemberRow;

const SchedulerMemberTableRow = styled.tr<{visible: boolean}>`
  display: ${props => (props.visible ? "table-row" : "none")};
  transition: display 0.2s ease-in-out;
`;
