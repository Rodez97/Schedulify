import {useMemo, useState} from "react";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {Divider, Layout, Table, type TableColumnsType, Tag} from "antd/es";
import {Button, Space, Typography} from "antd/es";
import {
  FilePdfOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import "./RosterView.scss";
import groupBy from "lodash/groupBy";
import upperFirst from "lodash/upperFirst";
import {useNavigate} from "react-router-dom";
import isoWeek from "dayjs/plugin/isoWeek";
import {generateRosterPdf} from "./PDF/NewPDF";
import type Member from "../../types/Member";
import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import LoadingPage from "../../shared/LoadingPage";
import ErrorPage from "../../shared/PageError";
import GrayPageHeader from "../../shared/GrayPageHeader";
import {getShiftDayjsDate, getShiftDuration} from "../../types/helpers";
import {type Shift} from "../../types/Shift";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
import {
  minutesToTextDuration,
  parseWeekId,
} from "../../contexts/ScheduleData/helpers";
dayjs.extend(isoWeek);

export interface RosterData {
  member: Member;
  shift: Shift;
}

function RosterView() {
  const navigate = useNavigate();
  const {memberShifts, weekDays, weekId, loading, error} = useSchedule();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const {t} = useTranslation();
  const {schedule, members} = useSelectedTeam();

  const sortedMembers = useMemo(() => {
    // Return the array sorted by name
    return members.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  }, [members]);

  const columns = useMemo(
    (): TableColumnsType<RosterData> => [
      {
        title: t("members"),
        dataIndex: "employee",
        key: "employee",
        render: (_, {member}) => member.displayName,
        sorter: {
          compare: (a, b, order) => {
            if (order === "ascend") {
              return a.member.displayName.localeCompare(b.member.displayName);
            }
            if (order === "descend") {
              return b.member.displayName.localeCompare(a.member.displayName);
            }
            return 0;
          },
        },
      },
      {
        title: t("position"),
        dataIndex: "position",
        key: "position",
        render: (_, {shift}) => {
          return shift.position != null ? (
            <Tag color="processing">{shift.position}</Tag>
          ) : (
            <Tag color="error">{t("no.position")}</Tag>
          );
        },
      },
      {
        title: t("start"),
        dataIndex: "start",
        key: "start",
        render: (_, {shift}) =>
          getShiftDayjsDate(shift, "start").format("h:mm a"),
      },
      {
        title: t("end"),
        dataIndex: "end",
        key: "end",
        render: (_, {shift}) =>
          getShiftDayjsDate(shift, "end").format("h:mm a"),
      },
      {
        title: t("time"),
        dataIndex: "time",
        key: "time",
        render: (_, {shift}) => {
          return minutesToTextDuration(getShiftDuration(shift).totalMinutes);
        },
      },
    ],
    [t],
  );

  const dataSource = useMemo(() => {
    const shiftsCollection: RosterData[] = [];
    memberShifts
      .map(({member, shifts}) => ({
        memberId: member.id,
        shiftsColl: shifts.filter(shift =>
          getShiftDayjsDate(shift, "start").isSame(
            weekDays[selectedDateIndex],
            "day",
          ),
        ),
      }))
      .forEach(shiftsDoc => {
        shiftsDoc.shiftsColl.forEach(shift => {
          const employee = sortedMembers.find(e => e.id === shiftsDoc.memberId);
          if (employee != null) {
            shiftsCollection.push({
              shift,
              member: employee,
            });
          }
        });
      });

    return groupBy(shiftsCollection, ({shift}) =>
      getShiftDayjsDate(shift, "start").format("a"),
    );
  }, [sortedMembers, memberShifts, weekDays, selectedDateIndex]);

  const currentWeekText = useMemo(() => {
    const {start, end} = parseWeekId(weekId);

    const firstDayWeek = start.format("MMM DD");
    const lastDayWeek = end.format("MMM DD");
    return `${firstDayWeek} - ${lastDayWeek}`.toUpperCase();
  }, [weekId]);

  const generatePDF = async () => {
    const amRoster = dataSource.am ?? [];
    const pmRoster = dataSource.pm ?? [];
    await generateRosterPdf(
      amRoster,
      pmRoster,
      weekId,
      weekDays[selectedDateIndex],
      schedule.name,
    );
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  return (
    <Layout css={{overflowX: "auto"}}>
      <GrayPageHeader
        onBack={() => {
          navigate(-1);
        }}
        title={t("roster")}
        subTitle={currentWeekText}
        extra={
          <Button
            onClick={generatePDF}
            icon={<FilePdfOutlined />}
            type="dashed">
            {t("generate.pdf.btn")}
          </Button>
        }
      />
      <Layout.Content>
        <div css={{display: "flex", flexDirection: "column", padding: 20}}>
          <Space
            align="center"
            wrap
            css={{justifyContent: "center", padding: "10px 5px"}}>
            <Button
              onClick={() => {
                setSelectedDateIndex(si => (si === 0 ? 6 : si - 1));
              }}
              shape="circle"
              icon={<LeftCircleOutlined />}
              type="text"
            />
            <Typography.Text type="secondary" css={{fontSize: 18}}>
              {upperFirst(
                weekDays[selectedDateIndex].format("dddd, MMMM DD, YYYY"),
              )}
            </Typography.Text>
            <Button
              onClick={() => {
                setSelectedDateIndex(si => (si === 6 ? 0 : si + 1));
              }}
              shape="circle"
              icon={<RightCircleOutlined />}
              type="text"
            />
          </Space>

          <Divider>{t("am.shifts")}</Divider>

          <Table
            className="rosterTable"
            scroll={{x: 1000}}
            size="small"
            bordered
            columns={columns}
            dataSource={dataSource.am}
            pagination={false}
            rowKey={e => e.shift.id}
            tableLayout="fixed"
          />

          <Divider>{t("pm.shifts")}</Divider>

          <Table
            className="rosterTable"
            size="small"
            bordered
            columns={columns}
            dataSource={dataSource.pm}
            pagination={false}
            rowKey={e => e.shift.id}
            tableLayout="fixed"
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default RosterView;
