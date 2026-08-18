// analytics.js
// Lightweight event & page tracking for BudgetDaily
// Supports Google Analytics 4 (GA4) if VITE_GA_MEASUREMENT_ID is configured

export const analytics = {
  pageView(path) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path || window.location.pathname,
      })
    }
  },
  trackEvent(eventName, params = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
    // Also log in dev
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event: ${eventName}]`, params)
    }
  },
  trackCheckoutStart(planId, price) {
    this.trackEvent('begin_checkout', {
      plan: planId,
      value: price,
      currency: 'USD',
    })
  },
  trackTransactionAdded(type, amount, category) {
    this.trackEvent('add_transaction', {
      type,
      amount,
      category,
    })
  },
}
