import {ReadonlyScheduleProvider} from "./ReadonlyScheduleProvider";
import ReadonlyScheduleView from "./ReadonlyScheduleView";

export default function ReadonlySchedule() {
  return (
    <ReadonlyScheduleProvider>
      <ReadonlyScheduleView />
    </ReadonlyScheduleProvider>
  );
}
