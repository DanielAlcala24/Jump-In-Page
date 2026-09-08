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

  // Un puerto mal escrito (p. ej. 456 en vez de 465) no da error de configuración:
  // el socket simplemente se queda colgado hasta agotar el tiempo y el correo nunca
  // sale. Se avisa en el log para que se note de inmediato.
  if (![465, 587, 25, 2525].includes(port)) {
    console.warn(
      `SMTP_PORT=${port} no es un puerto SMTP habitual (465 SSL / 587 STARTTLS). ` +
        'Revisa la variable de entorno: un puerto equivocado hace que el envío falle por timeout.'
    )
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
    // Sin estos límites, un puerto/host inalcanzable deja la función colgada ~2 min
    // (el default del SO) antes de fallar.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })
}

export function getFromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || ''
}
