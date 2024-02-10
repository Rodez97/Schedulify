import {type MemberShifts} from "../contexts/ScheduleData/useScheduleData";
import type Member from "../types/Member";
import {type Shift} from "../types/Shift";
import {getShiftDuration} from "../types/helpers";

export function checkMemberPositions(
  member: Member,
  positions: string[],
): boolean {
  if (member.positions == null) {
    return false;
  }
  return positions.some(position => member.positions?.includes(position));
}

export const getMemberHours = (employeeId: string, shifts: Shift[]) => {
  if (shifts.length == null) {
    return 0;
  }
  const employeeShifts = shifts.filter(shift => shift.memberId === employeeId);
  return employeeShifts.reduce((acc, shift) => {
    return acc + getShiftDuration(shift).totalHours;
  }, 0);
};

export const getEmployeeAndShifts = (
  members: Member[],
  shifts: Shift[],
): MemberShifts[] =>
  members.map(member => ({
    member,
    shifts: shifts.filter(s => s.memberId === member.id),
  }));
