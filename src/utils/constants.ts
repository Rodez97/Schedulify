import {type Weekday} from "../Pages/Schedule/WeekdaysPicker";

export enum SCHEDULE_VISIBILITY {
  ALL = "all",
  ALL_SCHEDULED = "all_scheduled",
}

export const DEFAULT_SCHEDULE_LIMITS = {
  collaborators: 3,
  members: 20,
};

export const WEEKFORMAT: "[W]-W-YYYY" = "[W]-W-YYYY" as const;

export const SHIFTFORMAT: "DD-MM-YYYY HH:mm" = "DD-MM-YYYY HH:mm" as const;

export const WEEKDAYS: Weekday[] = [
  {label: "Monday", value: 1},
  {label: "Tuesday", value: 2},
  {label: "Wednesday", value: 3},
  {label: "Thursday", value: 4},
  {label: "Friday", value: 5},
  {label: "Saturday", value: 6},
  {label: "Sunday", value: 7},
];
