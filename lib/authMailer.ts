type AuthMailInput = {
  to: string;
  subject: string;
  text: string;
  code: string;
};

export async function sendAuthCodeMail(input: AuthMailInput) {
  const smtpHost = process.env.MAIL_HOST;
  const smtpUser = process.env.MAIL_USERNAME;
  const smtpPass = process.env.MAIL_PASSWORD;

  const webhookUrl = process.env.AUTH_EMAIL_WEBHOOK_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.AUTH_FROM_EMAIL;
  const fromName = process.env.AUTH_FROM_NAME || "Nityagro";

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: input.to,
        subject: input.subject,
        text: input.text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to deliver mail via AUTH_EMAIL_WEBHOOK_URL");
    }

    return;
  }

  if (resendApiKey && fromEmail) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [input.to],
        subject: input.subject,
        text: input.text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Resend mail send failed: ${errText}`);
    }

    return;
  }

  if (smtpHost && smtpUser && smtpPass) {
    const { sendMail } = await import("@/lib/mailer");
    const html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2>${input.subject}</h2>
        <p>${input.text}</p>
        <div style="margin: 16px 0; padding: 12px 16px; background: #f3f4f6; border-radius: 8px; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
          ${input.code}
        </div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `;

    await sendMail({
      to: input.to,
      subject: input.subject,
      text: input.text,
      html,
    });
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Auth email provider not configured. Set AUTH_EMAIL_WEBHOOK_URL or RESEND_API_KEY + AUTH_FROM_EMAIL in production."
    );
  }

  console.log(`[AUTH OTP] ${input.to}: ${input.code}`);
}
