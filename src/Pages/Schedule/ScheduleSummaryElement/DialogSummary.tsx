import {Descriptions, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {minutesToTextDuration} from "../../../contexts/ScheduleData/helpers";

function DialogSummary({
  open,
  onClose,
  totalHours,
  totalPeople,
  totalShifts,
}: {
  open: boolean;
  onClose: () => void;
  totalHours: number;
  totalPeople: number;
  totalShifts: number;
}) {
  const {t} = useTranslation();
  return (
    <Modal open={open} onOk={onClose} title={t("schedule.summary")}>
      <Descriptions bordered size="small" layout="horizontal" column={1}>
        <Descriptions.Item label={t("scheduled.hours")}>
          {minutesToTextDuration(totalHours * 60)}
        </Descriptions.Item>

        <Descriptions.Item label={t("people")}>{totalPeople}</Descriptions.Item>

        <Descriptions.Item label={t("shifts")}>{totalShifts}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default DialogSummary;
