// Vercel Serverless Function: /api/create-polar-checkout
// Creates a Polar.sh Checkout Session using Organization Access Token (OAT)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const token = process.env.POLAR_ACCESS_TOKEN || 'polar_oat_uURiXVRnxqmxR9K5P5wmzE69WnhJZ3TBTbWYw3p4Zdq'
  const { planId, planName, amount, currency = 'USD', productId, email, userId, successUrl, cancelUrl } = req.body || {}

  if (!token) {
    return res.status(500).json({ error: 'Polar Access Token is missing' })
  }

  try {
    // Build payload for Polar API checkout
    const bodyPayload = {
      customer_email: email || undefined,
      success_url: successUrl || `${req.headers.origin || ''}/dashboard?checkout=success`,
      metadata: {
        userId: userId || 'anonymous',
        planId: planId || 'monthly',
        planName: planName || 'Pro Monthly',
      },
    }

    // If a specific Polar product ID or price ID is configured
    if (productId) {
      bodyPayload.product_id = productId
    }

    const polarRes = await fetch('https://api.polar.sh/v1/checkouts/custom/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    })

    const data = await polarRes.json()

    if (!polarRes.ok) {
      console.error('Polar API Error:', JSON.stringify(data))
      return res.status(polarRes.status).json({
        error: data.error || (Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail) || 'Failed to create Polar checkout session',
        details: data,
      })
    }

    return res.status(200).json({
      url: data.url,
      checkoutId: data.id,
    })
  } catch (err) {
    console.error('Server error creating Polar checkout:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
