import { firestore as firestoreAdmin } from "firebase-admin";
import { firestore } from "firebase-functions/v1";
import { FREE_LIMITS, PREMIUM_LIMITS } from "./config";

export const onScheduleCreated = firestore
  .document("schedules/{scheduleId}")
  .onCreate(async (doc) => {
    const ownerId = doc.get("ownerId");
    const tier = doc.get("tier");

    // Check if the owner has a premium account
    const subs = await firestoreAdmin()
      .collection("customers")
      .doc(ownerId)
      .collection("subscriptions")
      .where("status", "in", ["trialing", "active"])
      .get();

    if (subs.empty && tier === "premium") {
      // Delete the schedule
      await doc.ref.update({
        tier: "free",
        limits: FREE_LIMITS,
      });
      return;
    }

    if (subs.size === 1 && tier === "free") {
      // Delete the schedule
      await doc.ref.update({
        tier: "premium",
        limits: PREMIUM_LIMITS,
      });
      return;
    }
  });

export const onScheduleDeleted = firestore
  .document("schedules/{scheduleId}")
  .onDelete(async (_, context) => {
    // Remove all the requests from the schedule and all the data
    // from the user's requests
    const { scheduleId } = context.params;

    const bulkWriter = firestoreAdmin().bulkWriter();

    const requestsQuery = firestoreAdmin()
      .collection("collaboratorRequests")
      .where("scheduleId", "==", scheduleId);
    const membershipDocRef = firestoreAdmin()
      .collection("scheduleMembership")
      .doc(scheduleId);

    bulkWriter.delete(membershipDocRef);

    const requestsSnap = await requestsQuery.get();

    requestsSnap.forEach((requestDoc) => {
      bulkWriter.delete(requestDoc.ref);
    });

    const scheduleDocRef = firestoreAdmin()
      .collection("schedules")
      .doc(scheduleId);

    // Recursively delete all the data from the schedule
    await firestoreAdmin().recursiveDelete(scheduleDocRef, bulkWriter);
  });
