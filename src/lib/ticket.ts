// Prefijo que lleva el contenido del código QR de una compra.
//
// OJO: aplica SOLO al QR. El `Id_Ticket` que se guarda en `shop_orders` y el que
// se manda en el webhook de venta a DECManager siguen siendo el GUID puro, sin
// prefijo. Si algún día eso cambia, hay que cambiarlo en el webhook de Stripe,
// no aquí.
export const QR_TICKET_PREFIX = '07/'

/** Contenido que se codifica dentro del QR: "07/<Id_Ticket>". */
export function buildQrContent(idTicket: string): string {
  return `${QR_TICKET_PREFIX}${idTicket}`
}
