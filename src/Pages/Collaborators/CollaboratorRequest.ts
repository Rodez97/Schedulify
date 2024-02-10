import {
  type DocumentData,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type Timestamp,
  type FirestoreDataConverter,
} from "firebase/firestore";

export interface CollaboratorRequest {
  id: string;
  scheduleId: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
}

export const CollaboratorRequestConverter: FirestoreDataConverter<CollaboratorRequest> =
  {
    toFirestore(
      object: PartialWithFieldValue<CollaboratorRequest>,
    ): DocumentData {
      return {...object, updatedAt: new Date().getTime()};
    },
    fromFirestore(
      value: QueryDocumentSnapshot<CollaboratorRequest>,
      options: SnapshotOptions,
    ): CollaboratorRequest {
      const {id} = value;
      const rawData = value.data(options);
      return {
        ...rawData,
        id,
      };
    },
  };
