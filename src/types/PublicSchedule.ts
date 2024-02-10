import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type Timestamp,
} from "firebase/firestore";
import {type MemberShifts} from "../contexts/ScheduleData/useScheduleData";

interface PublicSchedule {
  id: string;
  scheduleId: string;
  scheduleName: string;
  weekId: string;
  updatedAt: Timestamp;
  memberShifts: MemberShifts[];
  emails: string[];
  year: number;
  week: number;
  month: number;
  notify: {
    status: boolean;
    date: Timestamp;
  };
}

export const ReadonlyScheduleConverter: FirestoreDataConverter<PublicSchedule> =
  {
    toFirestore(object: PublicSchedule): DocumentData {
      return object;
    },
    fromFirestore(
      value: QueryDocumentSnapshot<PublicSchedule>,
      options: SnapshotOptions,
    ): PublicSchedule {
      const rawData = value.data(options);
      return rawData;
    },
  };

export default PublicSchedule;
