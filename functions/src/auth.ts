import { firestore } from "firebase-admin";
import { auth } from "firebase-functions/v1";

function getNameFromEmail(email: string) {
  return email.split("@")[0];
}

export const afterCreated = auth.user().onCreate((user) => {
  // Create a new document in the users collection
  // with the uid as the document ID
  const userDocRef = firestore().collection("users").doc(user.uid);

  return userDocRef.set({
    displayName: user.email ? getNameFromEmail(user.email) : "John Doe",
    email: user.email,
    photoUrl: user.photoURL,
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    marketingEmails: true,
  });
});

export const onDeleted = auth.user().onDelete(async (user) => {
  const batch = firestore().batch();

  const userDocRef = firestore().collection("users").doc(user.uid);

  batch.delete(userDocRef);

  // Delete all the user's schedules
  const schedules = await firestore()
    .collection("schedules")
    .where("ownerId", "==", user.uid)
    .get();

  if (!schedules.empty) {
    schedules.forEach((scheduleDoc) => {
      batch.delete(scheduleDoc.ref);
    });
  }

  // Delete all schedules where the user is a collaborator
  const schedulesWhereCollaborator = await firestore()
    .collection("schedules")
    .where(`collaborators`, "array-contains", user.uid)
    .get();

  if (!schedulesWhereCollaborator.empty) {
    schedulesWhereCollaborator.forEach((scheduleDoc) => {
      batch.update(scheduleDoc.ref, {
        collaborators: firestore.FieldValue.arrayRemove(user.uid),
      });

      batch.update(
        firestore().collection("scheduleMembership").doc(scheduleDoc.id),
        {
          [`collaborators.${user.uid}`]: firestore.FieldValue.delete(),
        }
      );
    });
  }

  // Delete all the user's requests
  const requests = await firestore()
    .collection("collaboratorRequests")
    .where("email", "==", user.email)
    .get();

  if (!requests.empty) {
    requests.forEach((requestDoc) => {
      batch.delete(requestDoc.ref);
    });
  }

  // Check if the user is a stripe customer
  const customer = await firestore()
    .collection("customers")
    .doc(user.uid)
    .get();

  if (customer.exists) {
    batch.delete(customer.ref);
  }

  return batch.commit();
});
