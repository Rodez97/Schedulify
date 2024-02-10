import {css} from "@emotion/react";
import dayjs from "dayjs";
import {useMemo, useState} from "react";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isToday from "dayjs/plugin/isToday";
import {useTranslation} from "react-i18next";
import ReadonlyEmpColumnCell from "./ReadonlyEmpColumnCell";
import ReadonlyShiftCell from "./ReadonlyShiftCell";
import {Empty, Input, Layout, Typography} from "antd/es";
import "../Schedule/Scheduler.scss";
import "../Schedule/ShiftTable.scss";
import type Member from "../../types/Member";
import GrayPageHeader from "../../shared/atoms/GrayPageHeader";
import {useReadonlySchedule} from "./useReadonlySchedule";
import WeekNavigator from "../../shared/WeekNavigator/WeekNavigator";
import {type Shift} from "../../types/Shift";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(isToday);

export interface ShiftsTable {
  key: string;
  members: Member[];
  shifts: Shift[] | undefined;
}

function ReadonlyScheduleView() {
  const {schedule, weekDays, weekId, setWeekId} = useReadonlySchedule();
  const {t} = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Create an array of objects containing employee data and their shifts
  const shiftsSource = useMemo(() => {
    const memberShifts =
      schedule?.memberShifts != null ? schedule?.memberShifts : [];

    const filtered =
      searchQuery !== ""
        ? memberShifts.filter(({member}) => {
            const fullName = member.displayName;
            const positions =
              member.positions != null ? member.positions.join(" ") : "";

            return (
              fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              positions.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        : memberShifts;

    return filtered.sort((a, b) => {
      const aName = a.member.displayName;
      const bName = b.member.displayName;

      return aName.localeCompare(bName);
    });
  }, [schedule?.memberShifts, searchQuery]);

  return (
    <Layout
      css={css`
        background-color: #fff;
        overflow: auto;
      `}>
      <GrayPageHeader
        title={
          <Typography.Text
            css={css`
              font-size: 16px;
              font-weight: 500;
              // Ellipsis for long schedule names
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}>
            {schedule?.scheduleName}
          </Typography.Text>
        }
      />

      <div className="scheduler-toolbar">
        <WeekNavigator onChange={setWeekId} currentWeekId={weekId} />

        <div>
          <Input.Search
            placeholder={t("search")}
            allowClear
            onChange={e => {
              setSearchQuery(e.currentTarget.value);
            }}
            value={searchQuery}
            className="scheduler-toolbar__search"
          />
        </div>
      </div>

      <Layout.Content css={{overflowX: "auto"}}>
        {schedule?.memberShifts?.length == null ? (
          <Empty
            css={{
              marginTop: 100,
            }}
          />
        ) : (
          <div className="table-wrapper">
            <table className="shift-table">
              <thead>
                <tr>
                  <th>{t("members")}</th>
                  {weekDays.map(weekday => (
                    <th
                      key={weekday.unix()}
                      className={weekday.isToday() ? "shift-th-today" : ""}>
                      {weekday.format("dddd, MMM D")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shiftsSource.map(({shifts, member}, index) => (
                  <tr key={member.id + index}>
                    <th>
                      <ReadonlyEmpColumnCell
                        member={member}
                        shifts={shifts}
                        key={member.id}
                      />
                    </th>
                    {weekDays.map(weekday => {
                      return (
                        <td key={weekday.toISOString()}>
                          <ReadonlyShiftCell
                            key={`${member.id}-${weekday.toISOString()}}`}
                            member={member}
                            allShifts={shifts ?? []}
                            column={weekday}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
}

export default ReadonlyScheduleView;
