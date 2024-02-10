import dayjs, {type Dayjs} from "dayjs";
import {useTranslation} from "react-i18next";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

interface Props {
  weekDays: Dayjs[];
}

function SchedulerTableHead({weekDays}: Props) {
  const {t} = useTranslation();
  return (
    <thead>
      <tr>
        <th>{t("members")}</th>
        {weekDays.map(weekday => {
          const dateString = weekday.format("dddd, MMM D");
          return (
            <th
              key={dateString}
              className={weekday.isToday() ? "shift-th-today" : ""}>
              {dateString}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default SchedulerTableHead;
