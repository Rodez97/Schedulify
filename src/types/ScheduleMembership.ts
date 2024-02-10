import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import type Member from "./Member";
import {type Collaborator} from "./Collaborator";

export interface ScheduleMembership {
  scheduleId: string;
  members?: Record<string, Member>;
  collaborators?: Record<string, Collaborator>;
}

export const ScheduleMembershipConverter: FirestoreDataConverter<ScheduleMembership> =
  {
    toFirestore(object: ScheduleMembership): DocumentData {
      return object;
    },
    fromFirestore(
      value: QueryDocumentSnapshot<ScheduleMembership>,
      options: SnapshotOptions,
    ): ScheduleMembership {
      const rawData = value.data(options);
      return rawData;
    },
  };
