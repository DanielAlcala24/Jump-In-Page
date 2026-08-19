import nodemailer from 'nodemailer'

// Transporter SMTP (Google Workspace).
// Variables de entorno requeridas:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=465
//   SMTP_USER=reservaciones@jumpin.com.mx   (la cuenta que envía)
//   SMTP_PASS=xxxx xxxx xxxx xxxx            (App Password de Google, NO la contraseña normal)
//   SMTP_FROM=Jump-In <reservaciones@jumpin.com.mx>
export function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  })
}

export function getFromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || ''
}
