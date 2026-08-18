// Vercel Serverless Function: /api/create-polar-checkout
// Creates a Polar.sh Checkout Session using Organization Access Token (OAT)
// Polar API v1: POST https://api.polar.sh/v1/checkouts/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const token = process.env.POLAR_ACCESS_TOKEN || 'polar_oat_uURiXVRnxqmxR9K5P5wmzE69WnhJZ3TBTbWYw3p4Zdq'
  const { productId, planId, email, userId, successUrl, cancelUrl } = req.body || {}

  const origin = req.headers.origin || 'https://budgetdaily.vercel.app'
  const finalSuccessUrl = successUrl || `${origin}/dashboard?checkout=success&plan=${planId || 'monthly'}`

  if (!productId) {
    return res.status(400).json({ error: 'Polar Product ID is required' })
  }

  try {
    const bodyPayload = {
      products: [productId],
      customer_email: email || undefined,
      success_url: finalSuccessUrl,
      metadata: {
        userId: userId || 'anonymous',
        planId: planId || undefined,
      },
    }

    const polarRes = await fetch('https://api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    })

    const data = await polarRes.json().catch(() => ({}))

    if (!polarRes.ok || !data.url) {
      console.error('Polar API Error:', JSON.stringify(data))
      return res.status(polarRes.status || 500).json({
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
    return res.status(500).json({ error: err?.message || 'Internal Server Error' })
  }
}
