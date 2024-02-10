import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type Timestamp,
} from "firebase/firestore";

export interface WeekSchedule {
  id: string;

  year: number;

  weekNumber: number;

  weekId: string;

  createdAt: Timestamp;

  updatedAt?: Timestamp;

  weekOrderFactor: number;
}

export const WeekScheduleConverter: FirestoreDataConverter<WeekSchedule> = {
  toFirestore(object: WeekSchedule): DocumentData {
    return object;
  },
  fromFirestore(
    value: QueryDocumentSnapshot<WeekSchedule>,
    options: SnapshotOptions,
  ): WeekSchedule {
    const rawData = value.data(options);
    return rawData;
  },
};
