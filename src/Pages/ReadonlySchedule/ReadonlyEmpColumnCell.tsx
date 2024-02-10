import {Typography} from "antd/es";
import ReadonlyEmployeeSecondaryElement from "./ReadonlyEmployeeSecondaryElement";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import type Member from "../../types/Member";
import {type Shift} from "../../types/Shift";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
dayjs.extend(LocalizedFormat);

interface ReadonlyEmpColumnCellProps {
  member: Member;
  shifts?: Shift[];
}

function ReadonlyEmpColumnCell({member, shifts}: ReadonlyEmpColumnCellProps) {
  const {user} = useMainUser();
  return (
    <div className="employee-cell">
      <div
        className="employee-cell__content"
        style={{
          backgroundColor: user.email === member.email ? "#e6f7ff" : "white",
        }}>
        <div className="employee-cell__content__secondary">
          <Typography.Text
            strong
            className="employee-cell__content__secondary__name">
            {member.displayName}
          </Typography.Text>

          <div className="employee-cell__content__secondary__extra">
            <ReadonlyEmployeeSecondaryElement memShifts={shifts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadonlyEmpColumnCell;
