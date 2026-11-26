/**
 * Helper to format date and time from epoch seconds
 */
export function formatClassDateTime(epochSeconds?: number, durationMinutes = 60) {
  if (!epochSeconds) {
    return {
      dateLabel: "TBD",
      timeRangeLabel: "TBD",
      badgeDateLabel: "TBD",
      badgeTimeLabel: "",
      isToday: false,
      isTomorrow: false,
    };
  }

  const date = new Date(epochSeconds * 1000);
  const now = new Date();

  // Check if today / tomorrow
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  // Format date label
  let dateLabel = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
  if (isToday) dateLabel = "Today";
  else if (isTomorrow) dateLabel = "Tomorrow";

  // Format time range
  const startTimeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endDate = new Date((epochSeconds + durationMinutes * 60) * 1000);
  const endTimeStr = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const timeRangeLabel = `${startTimeStr} - ${endTimeStr}`;

  // Format short badge for left square card (e.g. "TODAY 5:00 PM", "TOMORROW 7:00 PM", "SAT, 15 JUN 6:00 PM")
  const badgeDateLabel = isToday
    ? "TODAY"
    : isTomorrow
    ? "TOMORROW"
    : date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();

  const badgeTimeLabel = startTimeStr.toUpperCase();

  return {
    dateLabel,
    timeRangeLabel,
    badgeDateLabel,
    badgeTimeLabel,
    isToday,
    isTomorrow,
  };
}

/**
 * Creates Google Calendar Add-Event URL
 */
export function createGoogleCalendarUrl(
  title: string,
  epochSeconds?: number,
  durationMinutes = 60,
  details = "",
  location = ""
): string {
  if (!epochSeconds) return "#";

  const startDate = new Date(epochSeconds * 1000);
  const endDate = new Date((epochSeconds + durationMinutes * 60) * 1000);

  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details: details || "Join the interactive live coding session on CrackDSA.",
    location: location || "CrackDSA Live",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
