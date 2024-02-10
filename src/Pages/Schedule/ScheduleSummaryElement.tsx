import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Button, Descriptions, Modal, Statistic} from "antd/es";
import {useMediaQuery} from "@react-hook/media-query";
import {css} from "@emotion/react";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
import {
  getTotalWeekSummary,
  minutesToTextDuration,
} from "../../contexts/ScheduleData/helpers";

function ScheduleSummaryElement() {
  const {t} = useTranslation();
  const {shifts} = useSchedule();
  const {totalHours, totalPeople, totalShifts} = useMemo(
    () => getTotalWeekSummary(shifts),
    [shifts],
  );
  const matches = useMediaQuery("only screen and (max-width: 680px)");

  const showInDialog = () => {
    Modal.info({
      title: t("schedule.summary"),
      content: (
        <Descriptions bordered size="small" layout="horizontal" column={1}>
          <Descriptions.Item label={t("scheduled.hours")}>
            {minutesToTextDuration(totalHours * 60)}
          </Descriptions.Item>

          <Descriptions.Item label={t("people")}>
            {totalPeople}
          </Descriptions.Item>

          <Descriptions.Item label={t("shifts")}>
            {totalShifts}
          </Descriptions.Item>
        </Descriptions>
      ),
    });
  };

  return matches ? (
    <Button
      onClick={showInDialog}
      type="dashed"
      css={css`
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      `}
      block>
      {t("schedule.summary.btn")}
    </Button>
  ) : (
    <div className="schedule-summary">
      <Statistic
        title={t("scheduled.hours")}
        value={minutesToTextDuration(totalHours * 60)}
      />
      <Statistic title={t("people")} value={totalPeople} />
      <Statistic title={t("shifts")} value={totalShifts} />
    </div>
  );
}

export default ScheduleSummaryElement;
