// Vercel Serverless Function: /api/create-polar-checkout
// Creates a Polar.sh Checkout Session using Organization Access Token (OAT)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const token = process.env.POLAR_ACCESS_TOKEN || 'polar_oat_uURiXVRnxqmxR9K5P5wmzE69WnhJZ3TBTbWYw3p4Zdq'
  const { planId, planName, amount, currency = 'USD', email, userId, successUrl, cancelUrl } = req.body || {}

  if (!token) {
    return res.status(500).json({ error: 'Polar Access Token is not configured' })
  }

  try {
    // Call Polar API checkout endpoint
    const polarRes = await fetch('https://api.polar.sh/v1/checkouts/custom/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        customer_email: email || undefined,
        success_url: successUrl || `${req.headers.origin || ''}/dashboard?checkout=success`,
        metadata: {
          userId: userId || 'anonymous',
          planId: planId || 'monthly',
          planName: planName || 'Pro Monthly',
        },
      }),
    })

    const data = await polarRes.json()

    if (!polarRes.ok) {
      console.error('Polar API Error:', data)
      // If products need to be specified or if ad-hoc prices are required, return structured error
      return res.status(polarRes.status).json({
        error: data.error || data.detail || 'Polar API Error',
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
