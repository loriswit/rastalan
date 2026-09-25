import nodemailer from "nodemailer"

export function isMailingAvailable(): boolean {
  return (
    !!process.env.EMAIL_SERVER &&
    !!process.env.EMAIL_USER &&
    !!process.env.EMAIL_PASS &&
    !!process.env.EMAIL_SENDER &&
    !!process.env.EMAIL_RECIPIENT
  )
}

export async function sendMail(subject: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECIPIENT,
    subject,
    text,
  })
}

export async function trySendMail(subject: string, text: string): Promise<void> {
  try {
    await sendMail(subject, text)
  } catch (error) {
    console.error(`Failed to send email to ${process.env.EMAIL_RECIPIENT}`)
    console.error(`Reason: ${error}`)
  }
}
