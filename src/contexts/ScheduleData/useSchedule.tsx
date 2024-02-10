import {useContext} from "react";
import {ScheduleContext, type ScheduleContextProps} from "./ScheduleContext";

export const useSchedule = (): ScheduleContextProps => {
  const context = useContext(ScheduleContext);

  if (context == null) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }

  return context;
};
