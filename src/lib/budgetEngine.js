// budgetEngine.js
//
// Core rule of the product: "how much can I spend today?"
//
// Model: a budget has a total amount and a date range (start -> end).
// Every day, the allowance for TODAY = (total - spent so far) / (days remaining, including today).
//
// This single formula IS the "borrow from tomorrow" behavior:
// - If you overspend today, spent-so-far goes up, so tomorrow's
//   (total - spent) / (days remaining) shrinks automatically.
// - If you underspend today, tomorrow's allowance grows.
// No separate debt ledger needed — it falls out of recomputing daily.

import { differenceInCalendarDays, startOfDay, isBefore, isAfter } from 'date-fns'

/**
 * @param {Object} budget - { totalAmount, startDate, endDate } (dates are ISO strings)
 * @param {Array} expenses - [{ amount, date }]
 * @param {Date} today - defaults to now, injectable for testing
 */
export function computeBudgetStatus(budget, expenses, today = new Date()) {
  const start = startOfDay(new Date(budget.startDate))
  const end = startOfDay(new Date(budget.endDate))
  const todayStart = startOfDay(today)

  const totalDays = differenceInCalendarDays(end, start) + 1

  // Money spent from the start of the budget up to (not including) today
  const spentBeforeToday = sumExpenses(expenses, (d) => isBefore(d, todayStart) && !isBefore(d, start))
  const spentToday = sumExpenses(expenses, (d) => sameDay(d, todayStart))
  const totalSpent = spentBeforeToday + spentToday

  const remainingBudget = round2(budget.totalAmount - spentBeforeToday)

  let daysRemaining
  if (isAfter(todayStart, end)) {
    daysRemaining = 0 // budget period is over
  } else if (isBefore(todayStart, start)) {
    daysRemaining = totalDays // hasn't started yet
  } else {
    daysRemaining = differenceInCalendarDays(end, todayStart) + 1
  }

  // The allowance for today, computed BEFORE today's spending is subtracted.
  const todaysAllowance = daysRemaining > 0 ? round2(remainingBudget / daysRemaining) : 0

  const leftToday = round2(todaysAllowance - spentToday)
  const isOverToday = leftToday < 0

  // Tomorrow preview: what happens if you stop spending right now
  const remainingAfterToday = round2(remainingBudget - spentToday)
  const daysRemainingTomorrow = Math.max(daysRemaining - 1, 0)
  const tomorrowsAllowanceIfStopNow =
    daysRemainingTomorrow > 0 ? round2(remainingAfterToday / daysRemainingTomorrow) : 0

  const status = statusFromRatio(leftToday, todaysAllowance)

  return {
    totalDays,
    daysRemaining,
    totalBudget: budget.totalAmount,
    totalSpent: round2(totalSpent),
    remainingBudget: round2(budget.totalAmount - totalSpent),
    todaysAllowance,
    spentToday: round2(spentToday),
    leftToday,
    isOverToday,
    tomorrowsAllowanceIfStopNow,
    status, // 'safe' | 'warn' | 'over'
    periodEnded: daysRemaining === 0 && isAfter(todayStart, end),
    periodNotStarted: isBefore(todayStart, start),
  }
}

function statusFromRatio(leftToday, todaysAllowance) {
  if (leftToday < 0) return 'over'
  if (todaysAllowance <= 0) return 'over'
  const ratio = leftToday / todaysAllowance
  if (ratio <= 0.2) return 'warn'
  return 'safe'
}

function sumExpenses(expenses, predicate) {
  return expenses
    .filter((e) => predicate(startOfDay(new Date(e.date))))
    .reduce((sum, e) => sum + Number(e.amount), 0)
}

function sameDay(a, b) {
  return a.getTime() === b.getTime()
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/**
 * Guard used before logging a new expense.
 *
 * Enforcement model chosen for this product:
 * - Overspending TODAY is allowed. It's not a mistake, it's information —
 *   the engine automatically shrinks every future day's allowance to absorb it
 *   (that's the recompute in computeBudgetStatus, no separate debt tracking).
 * - Overspending the WHOLE budget (nothing left in any future day to absorb it)
 *   is hard-blocked, because there's nothing left to "borrow" from.
 */
export function canSpend(budget, expenses, amount, today = new Date()) {
  const statusBefore = computeBudgetStatus(budget, expenses, today)
  const wouldLeaveToday = round2(statusBefore.leftToday - amount)
  const totalRemainingAfter = round2(statusBefore.remainingBudget - amount)

  if (totalRemainingAfter < 0) {
    return {
      allowed: false,
      reason: 'This would put your entire budget over, with nothing left in future days to absorb it.',
      wouldLeaveToday,
      willBorrow: false,
    }
  }
  if (wouldLeaveToday < 0) {
    return {
      allowed: true,
      reason: "This goes over today's allowance. The rest of the period will absorb it — every remaining day's allowance shrinks a little.",
      wouldLeaveToday,
      willBorrow: true,
    }
  }
  return { allowed: true, reason: null, wouldLeaveToday, willBorrow: false }
}
