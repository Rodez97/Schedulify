import {
  type FirestoreDataConverter,
  type PartialWithFieldValue,
} from "firebase/firestore";

export interface MainUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber?: string;
  language?: string;
}

export const MainUserConverter: FirestoreDataConverter<MainUser> = {
  toFirestore: (user: PartialWithFieldValue<MainUser>) => user,
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return data as MainUser;
  },
};
