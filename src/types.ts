/** Shape of the assessment's events.json dataset. Datetimes are local ISO strings without a timezone suffix. */
export interface CalendarEvent {
  id: string;
  type: string;
  name: string;
  startDate: string;
  endDate: string;
}

export type EventInput = Omit<CalendarEvent, 'id'>;

export type EventType = "meeting" | "task" | "personal" | "other";

export const EVENT_TYPES = [
  { value: "meeting", label: "Meeting" },
  { value: "task", label: "Task" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
] as const;
