// polar.js
// Real Polar.sh Payment Gateway Integration for BudgetDaily
// Supports direct Polar Checkout links (https://buy.polar.sh/...) and custom product links

export const POLAR_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$1',
    priceNum: 1.0,
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_MONTHLY || import.meta.env.VITE_POLAR_CHECKOUT_URL || '',
  },
  half_yearly: {
    id: 'half_yearly',
    name: 'Pro 6 Months',
    price: '$5',
    priceNum: 5.0,
    period: 'for 6 mo',
    billing: 'Save $1 upfront · $0.83/mo',
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_6MONTHS || import.meta.env.VITE_POLAR_CHECKOUT_URL || '',
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Annual',
    price: '$9',
    priceNum: 9.0,
    period: '/ year',
    billing: 'Save 25% · Only $0.75/month',
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_YEARLY || import.meta.env.VITE_POLAR_CHECKOUT_URL || '',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Pro Lifetime Access',
    price: '$100',
    priceNum: 100.0,
    period: 'one-time',
    billing: 'Pay once, own forever · No renewals',
    checkoutUrl: import.meta.env.VITE_POLAR_CHECKOUT_URL_LIFETIME || import.meta.env.VITE_POLAR_CHECKOUT_URL || '',
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
    try {
      const url = new URL(plan.checkoutUrl)
      if (email) url.searchParams.set('customer_email', email)
      url.searchParams.set('success_url', successUrl)
      window.location.href = url.toString()
      return
    } catch {
      window.location.href = plan.checkoutUrl
      return
    }
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
  } catch (err) {
    console.warn('Polar API session note:', err)
  }

  // 3. If no direct link is set yet, guide the user to their Polar product
  alert('Polar Checkout Link is not configured yet. Please copy your Checkout Link from polar.sh/dashboard/products and set VITE_POLAR_CHECKOUT_URL in Vercel.')
}
