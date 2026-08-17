// Vercel Serverless Function: /api/polar-webhook
// Receives webhooks from Polar.sh for subscriptions and checkouts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const event = req.body
    const eventType = event.type || event.event || 'unknown'

    console.log(`Received Polar Webhook Event: ${eventType}`, JSON.stringify(event))

    // Handle subscription or order completed
    switch (eventType) {
      case 'subscription.created':
      case 'subscription.active':
      case 'order.created':
      case 'checkout.created': {
        const metadata = event.data?.metadata || {}
        console.log(`Processed Polar event for user ${metadata.userId || 'unknown'}`)
        break
      }
      default:
        break
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Error handling Polar webhook:', err)
    return res.status(400).json({ error: 'Webhook handler error' })
  }
}
