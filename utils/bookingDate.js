export function getMinimumBookingDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getBookingDateError(value, now = new Date()) {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Choose a valid date.";

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return "Choose a valid date.";
  }
  if (value < getMinimumBookingDate(now)) return "Choose today or a future date.";
  return "";
}

export function formatBookingDate(value) {
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(value));
}
