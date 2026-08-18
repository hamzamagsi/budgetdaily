// polar.js
// Real Polar.sh Payment Gateway Integration for BudgetDaily
// Connected with live Polar Checkout Links:
// 1. Monthly ($1.99), 6-Month ($9.99), 1-Year ($19.99): https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd
// 2. Lifetime ($100.00): https://buy.polar.sh/polar_cl_CETfGLCeSHolX0aXDO9IrGsZpoij9GG7ivBs010SPe4

export const POLAR_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$1.99',
    priceNum: 1.99,
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd',
  },
  half_yearly: {
    id: 'half_yearly',
    name: 'Pro 6 Months',
    price: '$9.99',
    priceNum: 9.99,
    period: 'for 6 mo',
    billing: 'Save upfront · $1.66/mo',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd',
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Annual',
    price: '$19.99',
    priceNum: 19.99,
    period: '/ year',
    billing: 'Best value · Only $1.66/month',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Pro Lifetime Access',
    price: '$100',
    priceNum: 100.0,
    period: 'one-time',
    billing: 'Pay once, own forever · No renewals',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_CETfGLCeSHolX0aXDO9IrGsZpoij9GG7ivBs010SPe4',
  },
}

/**
 * Initiates Real Polar.sh Hosted Checkout.
 * Directly navigates the user's browser to the official Polar.sh Checkout page.
 */
export function redirectToPolarCheckout({ planId, email }) {
  const plan = POLAR_PLANS[planId] || POLAR_PLANS.monthly
  const targetUrl = plan.checkoutUrl

  try {
    const url = new URL(targetUrl)
    if (email) {
      url.searchParams.set('customer_email', email)
    }
    window.location.href = url.toString()
  } catch {
    window.location.href = targetUrl
  }
}
