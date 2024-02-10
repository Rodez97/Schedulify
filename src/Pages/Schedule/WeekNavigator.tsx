import dayjs from "dayjs";
import {useMemo} from "react";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {Button, Space, Typography} from "antd/es";
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";
import {upperFirst} from "lodash";
import {css} from "@emotion/react";
import ThisWeekTag from "./ThisWeekTag";
import {parseWeekId} from "../../contexts/ScheduleData/helpers";
import {WEEKFORMAT} from "../../utils/constants";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

interface IWeekNavigator {
  onChange: (weekId: string) => void;
  currentWeekId: string;
}

function WeekNavigator({onChange, currentWeekId}: IWeekNavigator) {
  const forwardWeek = () => {
    const {start} = parseWeekId(currentWeekId);
    onChange(start.add(1, "week").format(WEEKFORMAT));
  };
  const backWeek = () => {
    const {start} = parseWeekId(currentWeekId);
    onChange(start.subtract(1, "week").format(WEEKFORMAT));
  };

  const textContent = useMemo(() => {
    const {start, end} = parseWeekId(currentWeekId);

    const firstDayWeek = upperFirst(start.format("MMMM DD"));
    const lastDayWeek = upperFirst(end.format("MMMM DD, YYYY"));
    return `${firstDayWeek} - ${lastDayWeek}`;
  }, [currentWeekId]);

  return (
    <div>
      <Space align="center" css={{justifyContent: "center"}}>
        <Button
          onClick={backWeek}
          shape="circle"
          icon={<LeftCircleOutlined />}
          type="text"
        />
        <Typography.Text
          type="secondary"
          css={css`
            font-size: 1.2rem;
            font-weight: 500;

            @media (max-width: 500px) {
              font-size: 1rem;
            }
          `}>
          {textContent}
        </Typography.Text>
        <Button
          onClick={forwardWeek}
          shape="circle"
          icon={<RightCircleOutlined />}
          type="text"
        />
      </Space>

      <ThisWeekTag key="thisWeek" />
    </div>
  );
}

export default WeekNavigator;
