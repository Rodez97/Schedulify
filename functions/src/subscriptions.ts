import { firestore as firestoreAdmin } from "firebase-admin";
import { firestore } from "firebase-functions/v1";
import { FREE_LIMITS, PREMIUM_LIMITS } from "./config";

export const onSubscriptionChanged = firestore
  .document("customers/{uid}/subscriptions/{subscriptionId}")
  .onUpdate(async (change, context) => {
    const { uid } = context.params;

    const afterStatus = change.after.get("status");
    const beforeStatus = change.before.get("status");

    if (afterStatus === beforeStatus) {
      return;
    }

    const userSchedules = await firestoreAdmin()
      .collection("schedules")
      .where("ownerId", "==", uid)
      .get();

    if (userSchedules.empty) {
      return;
    }

    const batch = firestoreAdmin().batch();

    if (afterStatus === "active" || afterStatus === "trialing") {
      userSchedules.forEach((scheduleDoc) => {
        batch.update(scheduleDoc.ref, {
          tier: "premium",
          limits: PREMIUM_LIMITS,
        });
      });
    } else {
      userSchedules.forEach((scheduleDoc) => {
        batch.update(scheduleDoc.ref, {
          tier: "free",
          limits: FREE_LIMITS,
        });
      });
    }

    await batch.commit();
  });

export const onSubscriptionCreated = firestore
  .document("customers/{uid}/subscriptions/{subscriptionId}")
  .onCreate(async (doc, context) => {
    const { uid } = context.params;
    const afterStatus = doc.get("status");

    const userSchedules = await firestoreAdmin()
      .collection("schedules")
      .where("ownerId", "==", uid)
      .get();

    if (userSchedules.empty) {
      return;
    }

    const batch = firestoreAdmin().batch();

    if (afterStatus === "active" || afterStatus === "trialing") {
      userSchedules.forEach((scheduleDoc) => {
        batch.update(scheduleDoc.ref, {
          tier: "premium",
          limits: PREMIUM_LIMITS,
        });
      });
    } else {
      userSchedules.forEach((scheduleDoc) => {
        batch.update(scheduleDoc.ref, {
          tier: "free",
          limits: FREE_LIMITS,
        });
      });
    }

    await batch.commit();
  });
