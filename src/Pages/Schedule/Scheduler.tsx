import {css} from "@emotion/react";
import dayjs from "dayjs";
import {useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isToday from "dayjs/plugin/isToday";
import {useTranslation} from "react-i18next";
import ScheduleSummaryElement from "./ScheduleSummaryElement/ScheduleSummaryElement";
import {
  Button,
  Dropdown,
  Empty,
  Input,
  Layout,
  Select,
  Typography,
} from "antd/es";
import "./Scheduler.scss";
import "./ShiftTable.scss";
import ManageShiftModal, {
  type ManageShiftModalRef,
} from "./Modals/ManageShiftModal";
import LegendModal from "./Modals/LegendModal";
import useGeneratePdfBtn from "./useGeneratePdfBtn";
import type Member from "../../types/Member";
import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import ErrorPage from "../../shared/PageError";
import GrayPageHeader from "../../shared/GrayPageHeader";
import PageHeaderButtons from "../../shared/PageHeaderButtons";
import ManageMemberDrawer, {
  type ManageMemberDrawerRef,
} from "./ManageMemberDrawer";
import CloneScheduleModal from "./Modals/CloneScheduleModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faClipboardUser,
  faClone,
  faFileExcel,
  faFileExport,
  faFilePdf,
  faGear,
  faPeopleGroup,
  faQuestion,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import ResponsiveButton from "../../shared/ResponsiveButton";
import SchedulerTableHead from "./SchedulerTableHead";
import SchedulerMemberRow from "./SchedulerMemberRow";
import {SCHEDULE_VISIBILITY} from "../../utils/constants";
import {type Shift} from "../../types/Shift";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
import WeekNavigator from "../../shared/WeekNavigator";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(isToday);

export interface ShiftsTable {
  key: string;
  members: Member[];
  shifts: Shift[] | undefined;
}

function Scheduler() {
  const {weekId, setWeekId, weekDays, error, openAddMemberDialog} =
    useSchedule();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {schedule, isOwner, members, usage} = useSelectedTeam();
  const [statusFilter, setStatusFilter] = useState(SCHEDULE_VISIBILITY.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const manageMemberDialogRef = useRef<ManageMemberDrawerRef>(null);
  const manageShiftDialogRef = useRef<ManageShiftModalRef>(null);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const {generatePdf, generatingFile, generateExcelFile} = useGeneratePdfBtn();
  const [legendDialogOpen, setLegendDialogOpen] = useState(false);

  // Create an array of objects containing employee data and their shifts
  const sortedMembers = useMemo(() => {
    return members.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  }, [members]);

  // if (loading) {
  //   return <LoadingPage />;
  // }

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  return (
    <Layout
      css={css`
        background-color: #fff;
        overflow: auto;
        & .ant-btn-default .ant-btn-icon {
          color: rgba(0, 0, 0, 0.65);
        }
      `}>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 64px;
          border-bottom: 1px solid #f0f0f0;
        `}>
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 8px;
          `}>
          <FontAwesomeIcon
            icon={faQuestion}
            onClick={() => {
              setLegendDialogOpen(true);
            }}
          />
          <Typography.Text
            css={css`
              font-size: 16px;
              font-weight: 500;
              // Ellipsis for long schedule names
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}>
            {schedule.name}
          </Typography.Text>
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 0;
          `}>
          <PageHeaderButtons
            key="pageHeaderButtons"
            mediaQuery="only screen and (max-width: 600px)"
            moreIcon={<FontAwesomeIcon icon={faGear} />}
            items={[
              {
                key: "collaborators",
                icon: <FontAwesomeIcon icon={faPeopleGroup} />,
                onClick: () => {
                  navigate("collaborators");
                },
                label: t("collaborators"),
                hidden: !isOwner,
              },
            ]}
          />
        </div>
      </div>

      <GrayPageHeader
        backIcon={null}
        title={
          <ResponsiveButton
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            onClick={openAddMemberDialog}
            mediaQuery="only screen and (max-width: 600px)"
            responsiveLabel={`(${usage.members}/${usage.maxMembers})`}>
            {t("add.member") + ` (${usage.members}/${usage.maxMembers})`}
          </ResponsiveButton>
        }
        extra={[
          <PageHeaderButtons
            key="pageHeaderButtons"
            mediaQuery="only screen and (max-width: 880px)"
            items={[
              {
                key: "clone",
                icon: <FontAwesomeIcon icon={faClone} />,
                onClick: () => {
                  setCloneDialogOpen(true);
                },
                label: t("clone.schedule.title"),
                type: "link",
              },
              {
                key: "navigateRoster",
                icon: <FontAwesomeIcon icon={faClipboardUser} />,
                onClick: () => {
                  navigate("roster");
                },
                label: t("roster"),
                type: "link",
              },
            ]}
          />,
          <Dropdown
            disabled={generatingFile}
            menu={{
              items: [
                {
                  key: "export.pdf",
                  label: t("export.pdf"),
                  onClick: generatePdf,
                  icon: <FontAwesomeIcon icon={faFilePdf} />,
                  danger: true,
                },
                {
                  key: "export.excel",
                  label: t("export.excel"),
                  onClick: generateExcelFile,
                  icon: <FontAwesomeIcon icon={faFileExcel} />,
                  style: {
                    color: "#16912a",
                  },
                },
              ],
            }}
            key="generateFile">
            <Button
              icon={<FontAwesomeIcon icon={faFileExport} />}
              loading={generatingFile}>
              {t("export.file")}
            </Button>
          </Dropdown>,
        ]}
      />

      <div className="scheduler-toolbar">
        <WeekNavigator onChange={setWeekId} currentWeekId={weekId} />

        <div>
          <Select
            defaultValue={SCHEDULE_VISIBILITY.ALL}
            onChange={setStatusFilter}
            value={statusFilter}
            options={[
              {
                label: t("all_members"),
                value: SCHEDULE_VISIBILITY.ALL,
              },
              {
                label: t("all_scheduled"),
                value: SCHEDULE_VISIBILITY.ALL_SCHEDULED,
              },
            ]}
            className="scheduler-toolbar__sort-emp"
          />
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

      <ScheduleSummaryElement />
      <Layout.Content css={{overflowX: "auto"}}>
        <div className="table-wrapper">
          <table className="shift-table">
            <SchedulerTableHead weekDays={weekDays} />
            <tbody>
              {sortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={weekDays.length + 1}>
                    <Layout.Content
                      css={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        padding: "32px 0",
                      }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t("schedule.noMembers")}
                        css={{marginTop: 32}}>
                        <Button type="primary" onClick={openAddMemberDialog}>
                          {t("add.member")}
                        </Button>
                      </Empty>
                    </Layout.Content>
                  </td>
                </tr>
              ) : (
                <>
                  {sortedMembers.map(member => (
                    <SchedulerMemberRow
                      key={member.id}
                      member={member}
                      statusFilter={statusFilter}
                      searchQuery={searchQuery}
                    />
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Layout.Content>

      <ManageShiftModal ref={manageShiftDialogRef} />

      <ManageMemberDrawer ref={manageMemberDialogRef} />

      <LegendModal
        visible={legendDialogOpen}
        onClose={() => {
          setLegendDialogOpen(false);
        }}
      />

      <CloneScheduleModal
        open={cloneDialogOpen}
        onCancel={() => {
          setCloneDialogOpen(false);
        }}
      />
    </Layout>
  );
}

export default Scheduler;
