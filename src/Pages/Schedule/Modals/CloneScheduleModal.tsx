import {Alert, Checkbox, Modal, Typography} from "antd/es";
import dayjs from "dayjs";
import {useEffect, useMemo, useState} from "react";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import WeekNavigator from "../WeekNavigator";
import {useTranslation} from "react-i18next";
import {useSelectedTeam} from "../../../contexts/SelectedTeam/useSelectedTeam";
import useCloneWeek from "../../../contexts/ScheduleData/actions/useCloneWeek";
import {useSchedule} from "../../../contexts/ScheduleData/useSchedule";
import {WEEKFORMAT} from "../../../utils/constants";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

function CloneScheduleModal(props: {open: boolean; onCancel: () => void}) {
  const {t} = useTranslation();
  const {members} = useSelectedTeam();
  const {weekId, weekDays, shifts} = useSchedule();
  const cloneWeek = useCloneWeek();
  const [isCloning, setIsCloning] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(
    weekDays[0].subtract(1, "week").format(WEEKFORMAT),
  );
  const [selectedEmployees, setSelectedEmployees] = useState(
    members.map(e => e.id),
  );

  useEffect(() => {
    setSelectedWeek(weekDays[0].subtract(1, "week").format(WEEKFORMAT));
  }, [weekDays]);

  const handleSelectedEmpChange = (empId: string) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(prev => prev.filter(e => e !== empId));
    } else {
      setSelectedEmployees(prev => [...prev, empId]);
    }
  };

  const clone = async () => {
    try {
      setIsCloning(true);
      await cloneWeek(selectedWeek, selectedEmployees);
      props.onCancel();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCloning(false);
    }
  };

  const canClone = useMemo(() => {
    if (
      selectedEmployees.length === 0 ||
      selectedWeek === weekId ||
      shifts.length > 0
    ) {
      return false;
    }

    return true;
  }, [selectedEmployees.length, selectedWeek, weekId, shifts.length]);

  return (
    <Modal
      title={t("clone.schedule.title")}
      {...props}
      onOk={clone}
      cancelText={t("btn.cancel")}
      confirmLoading={isCloning}
      okButtonProps={{disabled: !canClone}}>
      <Typography.Paragraph
        type="secondary"
        css={{
          textAlign: "center",
        }}>
        {t("clone.schedule.subtitle")}
      </Typography.Paragraph>
      <div css={{display: "flex", justifyContent: "center", margin: 10}}>
        <WeekNavigator
          currentWeekId={selectedWeek}
          onChange={setSelectedWeek}
        />
      </div>

      {weekId === selectedWeek && (
        <Alert
          showIcon
          type="warning"
          message={t("clone.schedule.same.week")}
        />
      )}
      {shifts.length > 0 && (
        <Alert
          css={{marginTop: 10}}
          showIcon
          type="warning"
          message={t("clone.schedule.with.shifts")}
        />
      )}
      <div
        css={{
          maxHeight: "50vh",
          overflowY: "auto",
          marginTop: 10,
          width: "100%",
        }}>
        {members.map(mem => (
          <div
            key={mem.id}
            css={{
              display: "flex",
              alignItems: "center",
              padding: 10,
              borderBottom: "1px solid #e8e8e8",
            }}>
            <Typography.Text
              ellipsis
              css={{
                marginLeft: 10,
                marginRight: 10,
                flex: 1,
              }}>
              {mem.displayName}
            </Typography.Text>
            <Checkbox
              checked={selectedEmployees.includes(mem.id)}
              onChange={() => {
                handleSelectedEmpChange(mem.id);
              }}
              disabled={!canClone}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default CloneScheduleModal;
