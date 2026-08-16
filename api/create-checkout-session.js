// Vercel serverless function: /api/create-checkout-session
// Creates a Stripe Checkout session for the monthly subscription.
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, email } = req.body
  if (!userId || !email) return res.status(400).json({ error: 'userId and email are required' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.PUBLIC_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.PUBLIC_URL}/subscribe?checkout=cancelled`,
      client_reference_id: userId,
      metadata: { userId },
    })
    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
