// Returns a number identifying which day/week/month a date falls in.
export function getPeriod(date, frequency) {
  const d = new Date(date);
  const days = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);

  if (frequency === 'weekly') return Math.floor((days + 3) / 7); // weeks start on Monday
  if (frequency === 'monthly') return d.getFullYear() * 12 + d.getMonth();
  return days; // daily
}

// Brings a habit up to date by counting the periods that ended since the last check.
// It returns an updated copy and does not touch the database.
export function settleHabit(habit, now = new Date()) {
  const current = getPeriod(now, habit.frequency);
  const h = { ...habit };

  // Never checked before: start tracking from the current period.
  if (h.last_period === null) {
    h.last_period = current;
    return h;
  }

  const ended = current - h.last_period; // how many periods finished since the last check
  if (ended <= 0) return h; // still the same period, nothing to settle

  const isQuit = h.type === 'quit';
  const marked = Boolean(h.period_marked); // MySQL gives 0 or 1
  const firstSucceeded = isQuit ? !marked : marked;
  const emptyPeriods = ended - 1; // periods in between where the user pressed nothing

  h.total_attempts += ended;

  // The period the user was in at the last check
  if (firstSucceeded) {
    h.streak += 1;
    h.successful_periods += 1;
  } else {
    h.streak = 0;
  }

  // Periods with no presses at all: a miss for build habits, a success for quit habits
  if (emptyPeriods > 0) {
    if (isQuit) {
      h.streak += emptyPeriods;
      h.successful_periods += emptyPeriods;
    } else {
      h.streak = 0;
    }
  }

  h.period_marked = false;
  h.last_period = current;
  return h;
}

// Brings a daily task up to date after one or more days have passed.
// Returns an updated copy and does not touch the database.
export function settleDaily(daily, now = new Date()) {
  const current = getPeriod(now, 'daily');
  const d = { ...daily };

  // Never checked before: start tracking from today.
  if (d.last_period === null) {
    d.last_period = current;
    return d;
  }

  const ended = current - d.last_period; // days that finished since the last check
  if (ended <= 0) return d; // still the same day

  // The streak only grows if the last tracked day was completed
  // and no day was skipped after it (ended === 1 means "yesterday").
  d.streak = Boolean(d.completed) && ended === 1 ? d.streak + 1 : 0;

  d.completed = false; // a new day starts unchecked
  d.last_period = current;
  return d;
}