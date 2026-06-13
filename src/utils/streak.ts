/**
 * Calculates the active streak (consecutive days) from a list of interaction date strings.
 *
 * The streak counts backwards from today (or yesterday if no activity today).
 * Each consecutive day with at least one interaction increments the streak.
 *
 * @param interactionDates - Array of ISO date strings representing user interactions
 * @returns The number of consecutive active days up to today
 */
export function calculateActiveStreak(interactionDates: string[]): number {
  if (!interactionDates || interactionDates.length === 0) return 0;

  const formatDateKey = (date: Date): string =>
    date.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const uniqueDays = Array.from(
    new Set(interactionDates.map((d) => formatDateKey(new Date(d))))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = formatDateKey(new Date());
  const yesterday = formatDateKey(new Date(Date.now() - 86400000));

  // Streak must start from today or yesterday
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  let activeDate = new Date(uniqueDays[0]);

  for (let i = 1; i < uniqueDays.length; i++) {
    const prevDate = new Date(uniqueDays[i]);
    const diffTime = activeDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      activeDate = prevDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}
