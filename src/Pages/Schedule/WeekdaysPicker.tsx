import {Checkbox, Col, Row} from "antd/es";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {useTranslation} from "react-i18next";
import {WEEKDAYS} from "../../utils/constants";
dayjs.extend(isoWeek);

interface WeekdaysPickerProps {
  onChange: (values: number[]) => void;
  value: number[];
  baseDay: number;
}

export interface Weekday {
  label: string;
  value: number;
}

function WeekdaysPicker({onChange, value, baseDay}: WeekdaysPickerProps) {
  const {t} = useTranslation();

  return (
    <Checkbox.Group name="applyTo" onChange={onChange} value={value}>
      <Row>
        {WEEKDAYS.map(({label, value}) => (
          <Col xs={12} sm={8} key={value}>
            <Checkbox value={value} disabled={Boolean(value === baseDay)}>
              {t(label)}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
}

export default WeekdaysPicker;
