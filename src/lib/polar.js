// polar.js
// Real Polar.sh Hosted Payment Gateway Integration for BudgetDaily
// Supports $1/month, $5/6-month, $9/year, and $100 Lifetime plans

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
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_MONTHLY || import.meta.env.VITE_POLAR_CHECKOUT_URL || '',
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
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_6MONTHS || '',
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
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_YEARLY || '',
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
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_LIFETIME || '',
    productId: import.meta.env.VITE_POLAR_PRODUCT_LIFETIME || '',
  },
}

/**
 * Initiates Real Polar.sh Hosted Checkout.
 * Redirects the customer to the official Polar.sh PCI-compliant checkout page.
 */
export async function redirectToPolarCheckout({ planId, email, userId }) {
  const plan = POLAR_PLANS[planId] || POLAR_PLANS.monthly
  const successUrl = `${window.location.origin}/dashboard?checkout=success&plan=${plan.id}`
  const cancelUrl = `${window.location.origin}/subscribe?checkout=cancelled`

  // 1. If direct Polar checkout link is configured (e.g. https://buy.polar.sh/...)
  if (plan.checkoutUrl) {
    const url = new URL(plan.checkoutUrl)
    if (email) url.searchParams.set('customer_email', email)
    url.searchParams.set('success_url', successUrl)
    window.location.href = url.toString()
    return
  }

  // 2. Try Serverless API checkout session creation
  try {
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

    if (response.ok && data.url) {
      window.location.href = data.url
      return
    }

    if (data.error) {
      throw new Error(data.error)
    }
  } catch (err) {
    console.warn('Polar API session creation note:', err.message)
  }

  // 3. Fallback to official Polar store checkout link
  const defaultPolarStore = `https://polar.sh/checkout?price_id=${plan.id}&success_url=${encodeURIComponent(successUrl)}`
  window.location.href = defaultPolarStore
}
