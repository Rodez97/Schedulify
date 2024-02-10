import "dotenv/config";
import * as collaboratorFunctions from "./collaborators";
import * as authFunctions from "./auth";
import * as scheduleFunctions from "./schedules";
import * as subscriptionsFunctions from "./subscriptions";
import * as userFunctions from "./user";
import * as publicScheduleFunctions from "./publicSchedule";
import { cert, initializeApp } from "firebase-admin/app";

initializeApp({
  credential: cert({
    projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
  }),
});

exports.collaborators = collaboratorFunctions;

exports.auth = authFunctions;

exports.schedules = scheduleFunctions;

exports.subscriptions = subscriptionsFunctions;

exports.user = userFunctions;

exports.publicSchedule = publicScheduleFunctions;
