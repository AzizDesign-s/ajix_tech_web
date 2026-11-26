/**
 * Dubai local time, as an external store.
 *
 * Why a store rather than useState + useEffect: a clock is, definitionally,
 * something outside React that changes on its own. useSyncExternalStore is
 * the API for exactly that — React handles the server/client snapshot split,
 * so there is no hydration mismatch, and there is no setState in an effect
 * body for `react-hooks/set-state-in-effect` to object to.
 *
 * One interval is shared by every subscriber, and it only runs while at least
 * one component is mounted.
 */

export const DUBAI_TZ = 'Asia/Dubai';

/**
 * Local working hours, used only to tell a visitor whether a reply is likely
 * now or in the morning. Nothing depends on it being exact.
 *
 * The UAE moved to a Monday–Friday working week in 2022. Adjust if yours
 * differs — this is presentation, not a commitment.
 */
export const WORKING_HOURS = { startHour: 9, endHour: 18, days: [1, 2, 3, 4, 5] } as const;

export interface DubaiClock {
  /** "21:53" */
  time: string;
  /** "Fri" */
  weekday: string;
  /** True during WORKING_HOURS, used for the "Outside hours" hint. */
  withinWorkingHours: boolean;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Reads the wall-clock time in Dubai regardless of where this runs. */
export function readDubaiClock(now: Date = new Date()): DubaiClock {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DUBAI_TZ,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  // en-GB renders midnight as "24" in some runtimes; normalise it to "00".
  const hourRaw = get('hour');
  const hour = hourRaw === '24' ? '00' : hourRaw;
  const weekday = get('weekday');
  const hourNumber = Number(hour);
  const dayNumber = WEEKDAY_INDEX[weekday];

  const withinWorkingHours =
    Number.isFinite(hourNumber) &&
    dayNumber !== undefined &&
    (WORKING_HOURS.days as readonly number[]).includes(dayNumber) &&
    hourNumber >= WORKING_HOURS.startHour &&
    hourNumber < WORKING_HOURS.endHour;

  return { time: `${hour}:${get('minute')}`, weekday, withinWorkingHours };
}

// ── Store ──────────────────────────────────────────────────────────────────

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let snapshot = '';

function compute(): string {
  const { time, weekday, withinWorkingHours } = readDubaiClock();
  // Serialised, because useSyncExternalStore compares snapshots by reference
  // and a fresh object every tick would re-render forever.
  return `${time}|${weekday}|${withinWorkingHours ? '1' : '0'}`;
}

export function subscribeToDubaiClock(onChange: () => void): () => void {
  listeners.add(onChange);

  if (timer === null) {
    snapshot = compute();
    // Thirty seconds: the display only shows minutes, and a tighter interval
    // would wake the main thread for nothing.
    timer = setInterval(() => {
      const next = compute();
      if (next === snapshot) return;
      snapshot = next;
      for (const listener of listeners) listener();
    }, 30_000);
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function getDubaiClockSnapshot(): string {
  if (snapshot === '') snapshot = compute();
  return snapshot;
}

/** Empty on the server: the time is not known until the client renders, and
 *  guessing it would guarantee a hydration mismatch. */
export function getDubaiClockServerSnapshot(): string {
  return '';
}

export function parseDubaiClock(value: string): DubaiClock | null {
  if (!value) return null;
  const [time, weekday, within] = value.split('|');
  return { time, weekday, withinWorkingHours: within === '1' };
}
