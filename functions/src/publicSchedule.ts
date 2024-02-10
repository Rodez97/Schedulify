import { firestore } from "firebase-functions/v1";
import { isEmpty } from "lodash";
import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";

// This will be used to send emails
const apiInstance = new TransactionalEmailsApi();

// This is the API key used to send emails
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY
);

export const onScheduleCreated = firestore
  .document("schedules/{scheduleId}/readonlySchedules/{weekId}")
  .onCreate(async (doc) => {
    const data = doc.data();

    const sendNotification = data.notify.status;
    const emails = data.emails;
    const scheduleName = data.scheduleName;

    await notify(sendNotification, emails, scheduleName);
  });

export const onScheduleUpdated = firestore
  .document("schedules/{scheduleId}/readonlySchedules/{weekId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    const beforePublishDate = before.notify.date;
    const afterPublishDate = after.notify.date;

    const compareDates = beforePublishDate.isEqual(afterPublishDate);

    if (compareDates) {
      return;
    }

    const sendNotification = after.notify.status;
    const emails = after.emails;
    const scheduleName = after.scheduleName;

    await notify(sendNotification, emails, scheduleName);
  });

const notify = async (
  sendNotification: string,
  emails: string[],
  scheduleName: string
) => {
  if (!sendNotification || isEmpty(emails)) {
    return;
  }

  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: "notifications@schedulify.pro",
    name: "Schedulify",
  };
  sendSmtpEmail.to = emails.map((email) => ({ email }));
  sendSmtpEmail.subject = "New schedule published";

  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <p>Hi there,</p>
        <p>A new schedule has been published on Schedulify.</p>
        <p>Schedule name: ${scheduleName}</p>
        <p>Click <a href="https://app.schedulify.pro">here</a> to view the schedule.</p>
        <p>Thanks,</p>
        <p>Schedulify</p>
      </body>
    </html>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (err) {
    console.error(err);
  }
};
