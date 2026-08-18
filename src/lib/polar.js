// polar.js
// Real Polar.sh Payment Gateway Integration for BudgetDaily
// Supports all Vercel environment variable name variants and direct Polar links

export const POLAR_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$1',
    priceNum: 1.0,
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    checkoutUrl:
      import.meta.env.VITE_POLAR_CHECKOUT_URL_1MONTH ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL_MONTHLY ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL ||
      '',
  },
  half_yearly: {
    id: 'half_yearly',
    name: 'Pro 6 Months',
    price: '$5',
    priceNum: 5.0,
    period: 'for 6 mo',
    billing: 'Save $1 upfront · $0.83/mo',
    checkoutUrl:
      import.meta.env.VITE_POLAR_CHECKOUT_URL_6MONTH ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL_6MONTHS ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL ||
      '',
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Annual',
    price: '$9',
    priceNum: 9.0,
    period: '/ year',
    billing: 'Save 25% · Only $0.75/month',
    checkoutUrl:
      import.meta.env.VITE_POLAR_CHECKOUT_URL_1YEAR ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL_YEARLY ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL ||
      '',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Pro Lifetime Access',
    price: '$100',
    priceNum: 100.0,
    period: 'one-time',
    billing: 'Pay once, own forever · No renewals',
    checkoutUrl:
      import.meta.env.VITE_POLAR_CHECKOUT_URL_LIFETIME ||
      import.meta.env.VITE_POLAR_CHECKOUT_URL ||
      '',
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

  let targetUrl = plan.checkoutUrl

  // Check if user has a valid URL configured (and not the placeholder https://api.example.com)
  if (targetUrl && !targetUrl.includes('example.com')) {
    try {
      const url = new URL(targetUrl)
      if (email) url.searchParams.set('customer_email', email)
      url.searchParams.set('success_url', successUrl)
      window.location.href = url.toString()
      return
    } catch {
      window.location.href = targetUrl
      return
    }
  }

  // If link is missing or still placeholder, show friendly popup
  alert(
    'Please paste your real Polar product link (e.g. https://buy.polar.sh/... or https://polar.sh/...) into Vercel or send it in chat so we can link it directly!'
  )
}
