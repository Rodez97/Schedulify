import {logEvent} from "firebase/analytics";
import {ANALYTICS} from "../firebase";

export function logAnalyticsEvent(
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventParams?: Record<string, any>,
) {
  logEvent(ANALYTICS, eventName, eventParams);
}

export function recordError(error: unknown) {
  // If the error has a message, log it
  if (error instanceof Error) {
    logEvent(ANALYTICS, "exception", {
      description: error.message,
      fatal: false,
    });
  } else {
    logEvent(ANALYTICS, "exception", {
      description: "Unknown error",
      fatal: false,
    });
  }

  // If the build in in development mode, log the error to the console
  if (import.meta.env.MODE === "development") {
    console.error(error);
  }

  // Return the error so it can be used in a catch block
  // If the error is not an instance of Error, it will be returned as a new Error object with the error as the message
  return error instanceof Error ? error : new Error(String(error));
}

export function errorTypeGuard<T extends Error>(
  error: unknown,
  attribute: keyof T,
): error is T {
  return error instanceof Error && attribute in error;
}
