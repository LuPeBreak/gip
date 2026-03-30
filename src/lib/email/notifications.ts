import { env } from "@/lib/env";
import { getTransporter } from "./client";
import {
  forceTransferTemplate,
  processTransferredByAdminTemplate,
  takeOverNotificationTemplate,
  transferRejectedTemplate,
  transferSentTemplate,
} from "./templates";

interface ProcessInfo {
  id: string;
  number: string;
  description: string;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
    text,
  });
  console.log(`Email enviado: ${subject} → ${to}`);
}

export async function notifyTransferSent(
  process: ProcessInfo,
  senderName: string,
  recipientEmail: string | null,
  recipientName: string,
  observation?: string | null,
) {
  if (!recipientEmail) {
    console.warn(
      `notifyTransferSent: destinatário sem email para processo ${process.number}`,
    );
    return;
  }

  const template = transferSentTemplate({
    processNumber: process.number,
    processDescription: process.description,
    processId: process.id,
    actorName: senderName,
    recipientName,
    observation,
  });

  await sendEmail(
    recipientEmail,
    template.subject,
    template.html,
    template.text,
  );
}

export async function notifyTransferRejected(
  process: ProcessInfo,
  rejectorName: string,
  recipientEmail: string | null,
  recipientName: string,
  reason: string,
) {
  if (!recipientEmail) {
    console.warn(
      `notifyTransferRejected: destinatário sem email para processo ${process.number}`,
    );
    return;
  }

  const template = transferRejectedTemplate({
    processNumber: process.number,
    processDescription: process.description,
    processId: process.id,
    actorName: rejectorName,
    recipientName,
    reason,
  });

  await sendEmail(
    recipientEmail,
    template.subject,
    template.html,
    template.text,
  );
}

export async function notifyForceTransfer(
  process: ProcessInfo,
  adminName: string,
  targetEmail: string | null,
  targetName: string,
  previousOwnerName: string,
  reason: string,
) {
  if (!targetEmail) {
    console.warn(
      `notifyForceTransfer: destinatário sem email para processo ${process.number}`,
    );
    return;
  }

  const template = forceTransferTemplate({
    processNumber: process.number,
    processDescription: process.description,
    processId: process.id,
    actorName: adminName,
    recipientName: targetName,
    previousOwnerName,
    reason,
  });

  await sendEmail(targetEmail, template.subject, template.html, template.text);
}

export async function notifyProcessTransferredByAdmin(
  process: ProcessInfo,
  newOwnerName: string,
  previousOwnerEmail: string | null,
  previousOwnerName: string,
  reason: string,
) {
  if (!previousOwnerEmail) {
    console.warn(
      `notifyProcessTransferredByAdmin: destinatário sem email para processo ${process.number}`,
    );
    return;
  }

  const template = processTransferredByAdminTemplate({
    processNumber: process.number,
    processDescription: process.description,
    processId: process.id,
    actorName: "",
    recipientName: previousOwnerName,
    newOwnerName,
    reason,
  });

  await sendEmail(
    previousOwnerEmail,
    template.subject,
    template.html,
    template.text,
  );
}

export async function notifyTakeOver(
  process: ProcessInfo,
  adminName: string,
  previousOwnerEmail: string | null,
  previousOwnerName: string,
  reason: string,
) {
  if (!previousOwnerEmail) {
    console.warn(
      `notifyTakeOver: destinatário sem email para processo ${process.number}`,
    );
    return;
  }

  const template = takeOverNotificationTemplate({
    processNumber: process.number,
    processDescription: process.description,
    processId: process.id,
    actorName: adminName,
    recipientName: previousOwnerName,
    reason,
  });

  await sendEmail(
    previousOwnerEmail,
    template.subject,
    template.html,
    template.text,
  );
}
