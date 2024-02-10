import {useContext} from "react";
import {
  ReadonlyScheduleContext,
  type ReadonlyScheduleProviderContextProps,
} from "./ReadonlyScheduleProvider";

type ReadonlyScheduleHook = ReadonlyScheduleProviderContextProps;

export const useReadonlySchedule = (): ReadonlyScheduleHook => {
  const context = useContext(ReadonlyScheduleContext);

  if (context == null) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }

  return context;
};
