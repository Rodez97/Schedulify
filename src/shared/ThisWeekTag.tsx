import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {useTranslation} from "react-i18next";
import {Tag, Tooltip} from "antd/es";
import {useMediaQuery} from "@react-hook/media-query";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {Colors} from "../utils/Colors";
import {useSchedule} from "../contexts/ScheduleData/useSchedule";
dayjs.extend(isoWeek);

function ThisWeekTag() {
  const {t} = useTranslation();
  const {weekDays} = useSchedule();
  const matches = useMediaQuery("only screen and (min-width: 500px)");

  return dayjs().isSame(weekDays[0], "isoWeek") ? (
    matches ? (
      <Tag key="thisWeek" color="processing">
        {t("this.week.tag")}
      </Tag>
    ) : (
      <Tooltip title={t("this.week.tag")}>
        <FontAwesomeIcon icon={faCircle} color={Colors.Green.Main} />
      </Tooltip>
    )
  ) : null;
}

export default ThisWeekTag;
