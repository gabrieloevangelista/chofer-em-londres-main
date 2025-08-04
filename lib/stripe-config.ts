import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não está definida nas variáveis de ambiente")
}

if (process.env.STRIPE_SECRET_KEY.includes('aqui')) {
  throw new Error("Configure uma chave válida do Stripe em STRIPE_SECRET_KEY")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
})
