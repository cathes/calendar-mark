import { format } from "date-fns";
import type { CalendarEvent } from "../types";

export const iso = (date: Date) => format(date, "yyyy-MM-dd");

export const timeLabel = (datetime: string) => {
  const [h, m] = datetime.slice(11, 16).split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const eventDate = (event: CalendarEvent) => event.startDate.slice(0, 10);

export const typeClass = (type: string) =>
  type.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
