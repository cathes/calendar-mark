import type { EventInput } from "../types";

const LOCAL_DATETIME_RE =
  /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function isValidLocalDateTime(value: string): boolean {
  if (!LOCAL_DATETIME_RE.test(value)) return false;
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute
  );
}

export function validateEvent(input: EventInput): string | null {
  if (!input.name.trim()) return "Add an event name.";
  if (!input.type.trim()) return "Choose an event type.";
  if (
    !isValidLocalDateTime(input.startDate) ||
    !isValidLocalDateTime(input.endDate)
  )
    return "Choose valid start and end dates and times.";
  if (new Date(input.endDate).getTime() <= new Date(input.startDate).getTime())
    return "End date and time must be later than the start.";
  return null;
}
