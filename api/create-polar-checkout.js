// Vercel Serverless Function: /api/create-polar-checkout
// Creates a Polar.sh Checkout Session using Organization Access Token (OAT)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // Require POLAR_ACCESS_TOKEN to be set in the environment.
  const token = process.env.POLAR_ACCESS_TOKEN
  const { planId, planName, amount, currency = 'USD', productId, email, userId, successUrl, cancelUrl } = req.body || {}

  if (!token) {
    // Fail loudly instead of falling back to a baked-in token to avoid accidental bypass.
    return res.status(500).json({ error: 'Polar Access Token is missing' })
  }

  try {
    // Build payload for Polar API checkout
    const bodyPayload = {
      // Polar expects an explicit customer email when available; omit if not provided.
      customer_email: email || undefined,
      success_url: successUrl || `${req.headers.origin || ''}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.origin || ''}/dashboard?checkout=canceled`,
      metadata: {
        userId: userId || 'anonymous',
        planId: planId || undefined,
        planName: planName || undefined,
      },
    }

    // If a specific Polar product ID is configured, include it.
    if (productId) {
      bodyPayload.product_id = productId
    }

    // Include an explicit amount/currency only when provided (Polar's API varies by account)
    if (typeof amount !== 'undefined') {
      bodyPayload.amount = amount
      bodyPayload.currency = currency
    }

    const polarRes = await fetch('https://api.polar.sh/v1/checkouts/custom/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    })

    // Attempt to parse JSON response; if parsing fails, surface a generic error.
    let data
    try {
      data = await polarRes.json()
    } catch (parseErr) {
      console.error('Failed to parse Polar response as JSON', parseErr)
      return res.status(502).json({ error: 'Invalid response from Polar API' })
    }

    if (!polarRes.ok) {
      // Don't log secrets; only log the error body returned by Polar for debugging.
      console.error('Polar API Error:', JSON.stringify(data))
      return res.status(polarRes.status).json({
        error:
          data.error || (Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail) || 'Failed to create Polar checkout session',
        details: data,
      })
    }

    return res.status(200).json({
      url: data.url,
      checkoutId: data.id,
      raw: data,
    })
  } catch (err) {
    console.error('Server error creating Polar checkout:', err)
    return res.status(500).json({ error: err?.message || 'Internal Server Error' })
  }
}
