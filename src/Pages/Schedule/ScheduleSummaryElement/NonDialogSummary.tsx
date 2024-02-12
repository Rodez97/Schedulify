import {Statistic} from "antd";
import {useTranslation} from "react-i18next";
import {minutesToTextDuration} from "../../../contexts/ScheduleData/helpers";

function NonDialogSummary({
  totalHours,
  totalPeople,
  totalShifts,
}: {
  totalHours: number;
  totalPeople: number;
  totalShifts: number;
}) {
  const {t} = useTranslation();
  return (
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

export default NonDialogSummary;
