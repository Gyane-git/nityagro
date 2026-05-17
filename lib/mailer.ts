import nodemailer from "nodemailer";

type SendMailArgs = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
};

const mailHost = process.env.MAIL_HOST;
const mailPort = Number(process.env.MAIL_PORT || 465);
const mailUser = process.env.MAIL_USERNAME;
const mailPass = process.env.MAIL_PASSWORD;
const mailSecure =
  process.env.MAIL_ENCRYPTION === "ssl" || mailPort === 465;

const fromAddress = process.env.MAIL_FROM_ADDRESS || "no-reply@example.com";
const fromName = process.env.MAIL_FROM_NAME || "Nityagro";

let transporter: any = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!mailHost || !mailUser || !mailPass) {
    throw new Error("MAIL_CONFIG_MISSING");
  }

  transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailSecure,
    auth: { user: mailUser, pass: mailPass },
  });

  return transporter;
}

export async function sendMail({
  to,
  subject,
  html,
  text,
  attachments,
}: SendMailArgs) {
  const transport = getTransporter();

  return transport.sendMail({
    from: `${fromName} <${fromAddress}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
}
