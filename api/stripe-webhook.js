// Vercel serverless function: /api/stripe-webhook
// Stripe calls this on every subscription lifecycle event. We mirror the
// status into the `subscriptions` table so the app can gate features
// instantly without calling Stripe on every page load.
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export const config = { api: { bodyParser: false } }

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature']
  const rawBody = await buffer(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const obj = event.data.object

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = obj.client_reference_id || obj.metadata?.userId
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.subscription,
        status: 'active',
      })
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: event.type === 'customer.subscription.deleted' ? 'canceled' : obj.status,
          current_period_end: new Date(obj.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', obj.id)
      break
    }
    default:
      break
  }

  res.status(200).json({ received: true })
}
