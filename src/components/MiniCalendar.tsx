import { isSameDay, isToday, format } from "date-fns";
import type { CalendarEvent } from "../types";
import { eventDate, iso } from "../lib/dateUtils";

type MiniCalendarProps = {
  date: Date;
  events: CalendarEvent[];
  onPick: (date: Date) => void;
};

export default function MiniCalendar({ date, events, onPick }: MiniCalendarProps) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return (
    <div className="mini-calendar">
      <div className="mini-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}${i}`}>{d}</span>
        ))}
      </div>
      <div className="mini-days">
        {Array.from({ length: 42 }, (_, i) => {
          const day = new Date(start);
          day.setDate(start.getDate() + i);
          const active = isSameDay(day, date);
          const marked = events.some((event) => eventDate(event) === iso(day));
          return (
            <button
              key={iso(day)}
              className={`${day.getMonth() !== date.getMonth() ? "muted" : ""} ${active ? "chosen" : ""} ${isToday(day) ? "is-today" : ""} ${marked ? "marked" : ""}`}
              onClick={() => onPick(day)}
              aria-label={format(day, "MMMM d, yyyy")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
