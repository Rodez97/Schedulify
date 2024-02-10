import dayjs, {type Dayjs} from "dayjs";
import type React from "react";
import {useCallback, useEffect} from "react";
import {nanoid} from "nanoid";
import {useTranslation} from "react-i18next";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  TimePicker,
} from "antd/es";
import {useFormik} from "formik";
import {compact} from "lodash";
import WeekdaysPicker from "./WeekdaysPicker";
import type Member from "../../types/Member";
import {Timestamp} from "firebase/firestore";
import useCreateShift from "../../contexts/ScheduleData/actions/useCreateShift";
import useUpdateShift from "../../contexts/ScheduleData/actions/useUpdateShift";
import {type PrimaryShiftData, ShiftDate, type Shift} from "../../types/Shift";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";
import {WEEKFORMAT} from "../../utils/constants";
import {checkForOverlappingShiftsARRAY} from "../../contexts/ScheduleData/helpers/verifyOverlappingShifts";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

export interface ShiftFormDataType {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  notes?: string;
  position?: string;
  applyTo: number[];
}

interface ShiftEditorProps {
  member: Member;
  date: dayjs.Dayjs;
  isOpen: boolean;
  onClose: () => void;
  shift?: Shift;
  initialValues: ShiftFormDataType;
}

// Create an helper that changes all properties types for a given type
type ChangeType<T, TNewType> = {
  [P in keyof T]: TNewType;
};

const ShiftEditor: React.FC<ShiftEditorProps> = ({
  member,
  date,
  isOpen,
  onClose,
  shift,
  initialValues,
}) => {
  const {weekDays, shifts} = useSchedule();
  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const {t} = useTranslation();

  const validate = (values: ShiftFormDataType) => {
    const errors: Partial<ChangeType<ShiftFormDataType, string>> = {};
    if (values.start == null) {
      errors.start = t("startTime.required");
    }
    if (values.end == null) {
      errors.end = t("endTime.required");
    }
    const {start, end, applyTo} = values;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const normalizedApplyTo: number[] = applyTo ? compact(applyTo) : [];
    const overlaps = validateOverlappingShifts(normalizedApplyTo, start, end);
    if (overlaps) {
      errors.start = t("shifts.overlaps");
    }

    return errors;
  };

  const {
    values,
    setFieldValue,
    submitForm,
    handleChange,
    setValues,
    isSubmitting,
    errors,
  } = useFormik<ShiftFormDataType>({
    initialValues,
    validate,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      const {notes, position, start, end, applyTo} = values;

      const shiftToSave: PrimaryShiftData = {
        start: ShiftDate.toString(start.toDate()),
        end: ShiftDate.toString(end.toDate()),
        notes: notes ?? "",
        position: position ?? "",
      };

      const weekId = date.format(WEEKFORMAT);

      try {
        if (shift == null) {
          const newShift: Shift = {
            ...shiftToSave,
            id: nanoid(),
            updatedAt: Timestamp.now(),
            weekId,
            memberId: member.id,
            weekOrderFactor: 0,
          };
          await createShift(newShift, weekDays, applyTo);
        } else {
          await updateShift(shift, shiftToSave);
        }
        setStatus({success: true});
        onClose();
      } catch (error) {
        console.error(error);
        setStatus({success: false});
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    void setValues(initialValues);
  }, [initialValues, setValues]);

  const validateOverlappingShifts = useCallback(
    (applyTo: number[], startDayjs: dayjs.Dayjs, endDayjs: dayjs.Dayjs) => {
      const employeeShiftsArray = shifts.filter(
        ({memberId: employeeId}) => employeeId === member.id,
      );

      if (employeeShiftsArray.length === 0) {
        return false;
      }

      return applyTo.some(day => {
        const weekDay = weekDays.find(wd => wd.isoWeekday() === day);
        if (weekDay == null) {
          throw new Error(t("weekDay.notFound"));
        }
        const start = weekDay
          .hour(startDayjs.hour())
          .minute(startDayjs.minute());
        let end = weekDay.hour(endDayjs.hour()).minute(endDayjs.minute());
        // If end time is before start time, add a day to the end time
        if (end.isBefore(start)) {
          end = end.add(1, "day");
        }

        // Check if overlaps
        const shiftOverlaps = checkForOverlappingShiftsARRAY(
          employeeShiftsArray,
          start,
          end,
          shift != null ? shift.id : "",
        );

        return shiftOverlaps;
      });
    },
    [shifts, member.id, weekDays, shift, t],
  );

  const onTimeRangeChange = (value: [Dayjs, Dayjs]) => {
    const [start, end] = value;
    // If end time is before start time, add a day to the end time
    const fixedEnd = end.isBefore(start) ? end.add(1, "day") : end;
    void setFieldValue("start", start);
    void setFieldValue("end", fixedEnd);
  };

  return (
    <Drawer
      forceRender
      open={isOpen}
      width={400}
      onClose={onClose}
      title={t(shift == null ? "shift.add" : "shift.edit")}
      extra={
        <Space>
          <Button key="back" onClick={onClose} disabled={isSubmitting}>
            {t("btn.cancel")}
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={submitForm}
            loading={isSubmitting}>
            {t("btn.accept")}
          </Button>
        </Space>
      }>
      <Space size="small" direction="vertical">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            width: "100%",
          }}>
          <Form.Item css={{width: "100%"}} required help={t("startTime.help")}>
            <TimePicker
              name="start"
              allowClear={false}
              placeholder={t("start")}
              minuteStep={5}
              format="hh:mm a"
              use12Hours
              css={{width: "100%"}}
              showNow={false}
              value={values.start}
              onChange={value => {
                onTimeRangeChange([value, values.end]);
              }}
            />
          </Form.Item>

          <Form.Item css={{width: "100%"}} required help={t("endTime.help")}>
            <TimePicker
              name="end"
              allowClear={false}
              placeholder={t("end")}
              minuteStep={5}
              format="hh:mm a"
              use12Hours
              css={{width: "100%"}}
              showNow={false}
              value={values.end}
              changeOnBlur
              onChange={value => {
                onTimeRangeChange([values.start, value]);
              }}
            />
          </Form.Item>
        </div>

        <Divider />

        {shift == null && (
          <Form.Item label={t("shift.applyTo")}>
            <WeekdaysPicker
              value={values.applyTo}
              onChange={values => {
                void setFieldValue("applyTo", values);
              }}
              baseDay={date.isoWeekday()}
            />
          </Form.Item>
        )}

        {errors.start != null ? (
          <Alert type="error" message={errors.start as string} />
        ) : errors.end != null ? (
          <Alert type="error" message={errors.end as string} />
        ) : (
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          errors.applyTo && (
            <Alert type="error" message={errors.applyTo as string} />
          )
        )}

        <Select
          css={{width: "100%"}}
          placeholder={t("shift.setPosition")}
          value={values.position}
          onChange={value => {
            void setFieldValue("position", value);
          }}>
          <Select.Option value="">{t("no.position")}</Select.Option>
          {member.positions?.map(position => {
            return (
              <Select.Option key={position} value={position}>
                {position}
              </Select.Option>
            );
          })}
        </Select>

        <Divider />

        <Input.TextArea
          placeholder={t("shifts.notes")}
          showCount
          maxLength={500}
          rows={2}
          value={values.notes}
          name="notes"
          onChange={handleChange}
        />
      </Space>
    </Drawer>
  );
};

export default ShiftEditor;
