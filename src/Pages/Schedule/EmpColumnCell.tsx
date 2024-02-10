import {Dropdown, Typography} from "antd/es";
import EmployeeSecondaryElement from "./EmployeeSecondaryElement";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import type Member from "../../types/Member";
import {MoreOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import useSelectedTeamActions from "../../contexts/SelectedTeam/useSelectedTeamActions";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
dayjs.extend(LocalizedFormat);

interface EmpColumnCellProps {
  member: Member;
}

function EmpColumnCell({member}: EmpColumnCellProps) {
  const {t} = useTranslation();
  const {removeMember} = useSelectedTeamActions();
  const {openEditMemberDialog} = useSchedule();
  return (
    <article className="employee-cell">
      <div className="employee-cell__content">
        <Dropdown
          menu={{
            items: [
              {
                label: t("edit.member"),
                key: "0",
                onClick: () => {
                  openEditMemberDialog(member);
                },
              },
              {
                label: t("delete.member"),
                key: "1",
                onClick: () => {
                  void removeMember(member);
                },
              },
            ],
          }}
          trigger={["click"]}>
          <MoreOutlined
            onClick={e => {
              e.preventDefault();
            }}
            css={{
              border: "1px solid #d9d9d9",
              borderRadius: "50%",
              padding: "4px",
              fontSize: "12px",
            }}
          />
        </Dropdown>

        <div className="employee-cell__content__secondary">
          <Typography.Text
            strong
            className="employee-cell__content__secondary__name">
            {member.displayName}
          </Typography.Text>

          <div
            css={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}>
            <EmployeeSecondaryElement employeeId={member.id} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default EmpColumnCell;
