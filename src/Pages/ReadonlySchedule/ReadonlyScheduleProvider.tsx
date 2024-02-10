import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import {doc} from "firebase/firestore";
import {useParams} from "react-router-dom";
import {FIRESTORE} from "../../firebase";
import LoadingPage from "../../shared/molecules/LoadingPage";
import {useDocumentData} from "react-firebase-hooks/firestore";
import type PublicSchedule from "../../types/PublicSchedule";
import {ReadonlyScheduleConverter} from "../../types/PublicSchedule";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import {WEEKFORMAT} from "../../utils/constants";
import {getWeekDays} from "../../contexts/ScheduleData/helpers";
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export interface ReadonlyScheduleProviderContextProps {
  schedule?: PublicSchedule;
  weekId: string;
  setWeekId: Dispatch<SetStateAction<string>>;
  weekDays: dayjs.Dayjs[];
}

export const ReadonlyScheduleContext =
  createContext<ReadonlyScheduleProviderContextProps>({
    weekDays: [],
    setWeekId: () => {},
    weekId: "",
  });

/**
 * Props del Provider principal de la App
 */
export interface ReadonlyScheduleProviderProps {
  children: ReactNode;
}

export const ReadonlyScheduleProvider = ({
  children,
}: ReadonlyScheduleProviderProps) => {
  const {readonlyScheduleId} = useParams<{readonlyScheduleId: string}>();
  const [weekId, setWeekId] = useState(() => dayjs().format(WEEKFORMAT));
  const weekDays = useMemo(() => getWeekDays(weekId), [weekId]);

  // If there is no scheduleId, we throw an error
  if (readonlyScheduleId == null) {
    throw new Error("No scheduleId found.");
  }

  const [schedule, loading, error] = useDocumentData<PublicSchedule>(
    doc(
      FIRESTORE,
      "schedules",
      readonlyScheduleId,
      "readonlySchedules",
      weekId,
    ).withConverter(ReadonlyScheduleConverter),
  );

  if (loading) {
    return <LoadingPage />;
  }

  if (error != null) {
    throw error;
  }

  return (
    <ReadonlyScheduleContext.Provider
      value={{
        schedule,
        weekId,
        setWeekId,
        weekDays,
      }}>
      {children}
    </ReadonlyScheduleContext.Provider>
  );
};
