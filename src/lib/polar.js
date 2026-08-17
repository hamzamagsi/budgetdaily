// polar.js
// Polar.sh Payment Gateway Integration for BudgetDaily
// Supports $1/month, $5/6-month, $9/year, and $100 Lifetime plans

export const POLAR_CONFIG = {
  apiBase: 'https://api.polar.sh/v1',
  // No token here on purpose — this file runs in the browser. The real
  // access token lives ONLY in Vercel's env vars and is used server-side
  // inside api/create-polar-checkout.js, never shipped to the client.
}

export const POLAR_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 1.0,
    priceCents: 100,
    currency: 'USD',
    interval: 'month',
    label: '$1 / month',
    description: 'BudgetDaily Pro Monthly Access ($1/mo)',
    productId: import.meta.env.VITE_POLAR_PRODUCT_MONTHLY || '',
  },
  half_yearly: {
    id: 'half_yearly',
    name: 'Pro 6 Months',
    price: 5.0,
    priceCents: 500,
    currency: 'USD',
    interval: '6_months',
    label: '$5 / 6 months',
    description: 'BudgetDaily Pro 6-Month Plan ($5.00)',
    productId: import.meta.env.VITE_POLAR_PRODUCT_6MONTHS || '',
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Annual',
    price: 9.0,
    priceCents: 900,
    currency: 'USD',
    interval: 'year',
    label: '$9 / year',
    description: 'BudgetDaily Pro Annual Subscription ($9/yr)',
    productId: import.meta.env.VITE_POLAR_PRODUCT_YEARLY || '',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Pro Lifetime Access',
    price: 100.0,
    priceCents: 10000,
    currency: 'USD',
    interval: 'one_time',
    label: '$100 Lifetime',
    description: 'BudgetDaily Pro Lifetime VIP Pass ($100)',
    productId: import.meta.env.VITE_POLAR_PRODUCT_LIFETIME || '',
  },
}

/**
 * Creates a Polar Checkout session via /api/create-polar-checkout
 * Redirects to the live Polar.sh payment page.
 */
export async function createPolarCheckoutSession({ planId, email, userId }) {
  const plan = POLAR_PLANS[planId] || POLAR_PLANS.monthly
  const successUrl = `${window.location.origin}/dashboard?checkout=success&plan=${planId}`
  const cancelUrl = `${window.location.origin}/subscribe?checkout=cancelled`

  const response = await fetch('/api/create-polar-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      planId: plan.id,
      planName: plan.name,
      amount: plan.priceCents,
      currency: plan.currency,
      productId: plan.productId || undefined,
      email: email || '',
      userId: userId || 'anonymous',
      successUrl,
      cancelUrl,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.url) {
    const errorMsg = data.error || data.detail || 'Could not initiate Polar checkout session'
    throw new Error(errorMsg)
  }

  return { success: true, url: data.url }
}
