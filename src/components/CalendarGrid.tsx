import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { CalendarEvent } from "../types";

interface Props {
  date: Date;
  view: "month" | "week";
  events: CalendarEvent[];
  onSelectDate: (date: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const datePart = (value: string) => value.slice(0, 10);
const timePart = (value: string) => value.slice(11, 16);
const timeLabel = (value: string) => {
  const [h, m] = timePart(value).split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h >= 12 ? "PM" : "AM"}`;
};
const classType = (type: string) =>
  type.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
export default function CalendarGrid({
  date,
  view,
  events,
  onSelectDate,
  onSelectEvent,
}: Props) {
  const start =
    view === "month"
      ? startOfWeek(startOfMonth(date), { weekStartsOn: 0 })
      : startOfWeek(date, { weekStartsOn: 0 });
  const end =
    view === "month"
      ? endOfWeek(endOfMonth(date), { weekStartsOn: 0 })
      : addDays(start, 6);
  const days = eachDayOfInterval({ start, end });
  return (
    <div className={`calendar-grid ${view}-view`}>
      <div className="weekday-row">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="days-grid">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = events
            .filter((event) => datePart(event.startDate) === key)
            .sort((a, b) => a.startDate.localeCompare(b.startDate));
          return (
            <div
              key={key}
              className={`day-cell ${!isSameMonth(day, date) && view === "month" ? "outside-month" : ""} ${isToday(day) ? "today" : ""}`}
              onDoubleClick={() => onSelectDate(key)}
            >
              <button
                className="day-number"
                type="button"
                aria-label={`Add event on ${format(day, "MMMM d, yyyy")}`}
                onClick={() => onSelectDate(key)}
              >
                <span>{format(day, "d")}</span>
                {isToday(day) && <i />}
              </button>
              <div className="day-events">
                {dayEvents.slice(0, view === "month" ? 3 : 8).map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    className={`event-chip category-${classType(event.type)}`}
                    onClick={() => onSelectEvent(event)}
                    title={`${event.name}, ${timeLabel(event.startDate)}`}
                  >
                    <span className="event-time">
                      {view === "week"
                        ? `${timeLabel(event.startDate)} · `
                        : ""}
                    </span>
                    <span className="event-title">{event.name}</span>
                  </button>
                ))}
                {dayEvents.length > (view === "month" ? 3 : 8) && (
                  <button
                    className="more-events"
                    onClick={() => onSelectDate(key)}
                  >
                    +{dayEvents.length - (view === "month" ? 3 : 8)} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
