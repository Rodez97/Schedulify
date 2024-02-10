import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type Timestamp,
} from "firebase/firestore";

interface Team {
  id: string;
  ownerId: string;
  name: string;
  color: string;
  createdAt: Timestamp;
  members?: string[];
  collaborators?: string[];
  limits: {
    collaborators: number;
    members: number;
  };
}

export const ScheduleConverter: FirestoreDataConverter<Team> = {
  toFirestore(object: Team): DocumentData {
    return object;
  },
  fromFirestore(
    value: QueryDocumentSnapshot<Team>,
    options: SnapshotOptions,
  ): Team {
    const rawData = value.data(options);
    return rawData;
  },
};

export default Team;
