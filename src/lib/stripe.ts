import Stripe from 'stripe'

let client: Stripe | null = null

/**
 * Crea el cliente de Stripe la primera vez que se usa, no al importar el módulo.
 *
 * Si se creara al importar, el build falla ("Neither apiKey nor config.authenticator
 * provided") cuando STRIPE_SECRET_KEY no está configurada, porque Next ejecuta cada
 * route handler durante "collect page data". Así, sin la llave solo fallan las rutas
 * de la tienda al llamarlas, y el resto del sitio compila y despliega normal.
 */
function getStripe(): Stripe {
  if (!client) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error(
        'Falta la variable de entorno STRIPE_SECRET_KEY. Configúrala en el entorno para habilitar la tienda.'
      )
    }
    client = new Stripe(apiKey, {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return client
}

// Se usa igual que antes: stripe.checkout.sessions.create(...), stripe.products.list(...), etc.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripe()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
