import type Member from "../../../types/Member";
import type dayjs from "dayjs";
import ExcellentExport, {
  type ConvertOptions,
  type SheetOptions,
} from "excellentexport";
import {getShiftDayjsDate, getShiftIsoWeekday} from "../../../types/helpers";
import {type Shift} from "../../../types/Shift";
import {
  calculateTotalHoursByShifts,
  minutesToTextDuration,
} from "../../../contexts/ScheduleData/helpers";

export const generateExcel = async (
  rows: Array<{
    member: Member;
    shifts: Shift[];
  }>,
  scheduleName: string,
  weekId: string,
  weekDays: dayjs.Dayjs[],
) => {
  const options: ConvertOptions = {
    filename: `${scheduleName} - ${weekId}`,
    format: "xlsx",
    openAsDownload: true,
  };

  const headers = [
    "Name",
    ...weekDays.map(day => day.format("ddd D")),
    "Total",
  ];

  const data = rows.map(({member, shifts}) => {
    const totalHours = calculateTotalHoursByShifts(shifts);

    const mainData = weekDays.map(day => {
      const shiftsData = shifts.filter(
        shift => getShiftIsoWeekday(shift) === day.isoWeekday(),
      );

      return shiftsData.reduce((acc, shift) => {
        const startTime = getShiftDayjsDate(shift, "start").format("h:mma");
        const endTime = getShiftDayjsDate(shift, "end").format("h:mma");
        const fullTime = `${startTime} - ${endTime}`;

        return acc.length > 0 ? `${acc}${fullTime}\n` : fullTime;
      }, "");
    });

    return [
      member.displayName,
      ...mainData,
      minutesToTextDuration(totalHours * 60),
    ];
  });

  const sheet: SheetOptions = {
    name: "Sheet 1",
    from: {
      array: [headers, ...data],
    },
    formats: [
      {
        range: "A1:A100",
        format: ExcellentExport.formats.TEXT,
      },
      {
        range: "B2:H100",
        format: {
          type: "s",
          pattern: "@",
        },
      },
    ],
  };

  ExcellentExport.convert(options, [sheet]);
};
