// polar.js
// Real Polar.sh Payment Gateway Integration for BudgetDaily
// Connected with live multi-product Polar Checkout Links

export const POLAR_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$1.99',
    priceNum: 1.99,
    period: '/ month',
    billing: 'Billed monthly · cancel anytime',
    productId: 'e770a06a-19d9-4d42-8ef1-5e08dc60ca20',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd',
  },
  half_yearly: {
    id: 'half_yearly',
    name: 'Pro 6 Months',
    price: '$9.99',
    priceNum: 9.99,
    period: 'for 6 mo',
    billing: 'Save upfront · $1.66/mo',
    productId: '209d8464-af37-411e-9dd8-baf36ddd6ee5',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd',
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Annual',
    price: '$19.99',
    priceNum: 19.99,
    period: '/ year',
    billing: 'Best value · Only $1.66/month',
    productId: 'de02fb35-e732-4b5a-86b4-d89e708e2a08',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Pro Lifetime Access',
    price: '$100',
    priceNum: 100.0,
    period: 'one-time',
    billing: 'Pay once, own forever · No renewals',
    productId: '0a1ba203-23e5-450a-a6ef-8c03f60bc260',
    checkoutUrl: 'https://buy.polar.sh/polar_cl_CETfGLCeSHolX0aXDO9IrGsZpoij9GG7ivBs010SPe4',
  },
}

/**
 * Initiates Real Polar.sh Hosted Checkout.
 * Redirects the customer to the official Polar.sh PCI-compliant checkout page.
 */
export async function redirectToPolarCheckout({ planId, email, userId }) {
  const plan = POLAR_PLANS[planId] || POLAR_PLANS.monthly
  const targetUrl = plan.checkoutUrl || 'https://buy.polar.sh/polar_cl_7y25tiJCkjzmPhBzMsg0rxXmoTJ2dBZeJk3KI0wuCvd'
  window.location.href = targetUrl
}
