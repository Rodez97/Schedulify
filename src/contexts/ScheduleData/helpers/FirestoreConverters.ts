import {
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from "firebase/firestore";
import {type WeekSchedule} from "../../../types/WeekSchedule";
import {type Shift} from "../../../types/Shift";

export const shiftConverter: FirestoreDataConverter<Shift> = {
  toFirestore(
    object: PartialWithFieldValue<Shift> | WithFieldValue<Shift>,
  ): DocumentData {
    return {...object, updatedAt: new Date().getTime()};
  },
  fromFirestore(
    value: QueryDocumentSnapshot<Shift>,
    options: SnapshotOptions,
  ): Shift {
    const {id} = value;
    const rawData = value.data(options);
    return {
      ...rawData,
      id,
    };
  },
};

export const scheduleConverter = {
  toFirestore(object: PartialWithFieldValue<WeekSchedule>): DocumentData {
    return {...object, updatedAt: new Date().getTime()};
  },
  fromFirestore(
    value: QueryDocumentSnapshot<WeekSchedule>,
    options: SnapshotOptions,
  ): WeekSchedule {
    const {id} = value;
    const rawData = value.data(options);
    return {
      ...rawData,
      id,
    };
  },
};
