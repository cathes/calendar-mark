import { useEffect, useState, type FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CalendarEvent, EventInput, EVENT_TYPES } from "../types";
import { useNotification } from "@/components/NotificationProvider";

interface Props {
  open: boolean;
  initialDate: string;
  eventTypes: string[];
  event?: CalendarEvent;
  onClose: () => void;
  onSave: (input: EventInput) => string | null;
  onDelete?: () => void;
}
interface FormValues {
  name: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
}
const localDatePart = (value: string) => value.slice(0, 10);
const localTimePart = (value: string) => value.slice(11, 16);
const emptyForm = (date: string, type: string): FormValues => ({
  name: "",
  type,
  date,
  startTime: "09:00",
  endTime: "10:00",
});

export default function EventModal({
  open,
  initialDate,
  eventTypes,
  event,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const defaultType = eventTypes[0] ?? "meeting";
  const { notify } = useNotification();
  const [form, setForm] = useState<FormValues>(
    emptyForm(initialDate, defaultType),
  );
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setForm(
        event
          ? {
              name: event.name,
              type: event.type,
              date: localDatePart(event.startDate),
              startTime: localTimePart(event.startDate),
              endTime: localTimePart(event.endDate),
            }
          : emptyForm(initialDate, defaultType),
      );
      setError("");
    }
  }, [open, initialDate, event, defaultType]);

  if (!open) return null;
  const change = (key: keyof FormValues, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const input: EventInput = {
      name: form.name,
      type: form.type,
      startDate: `${form.date}T${form.startTime}:00`,
      endDate: `${form.date}T${form.endTime}:00`,
    };

    const message = onSave(input);

    if (message) {
      setError(message);
      notify(message, "error");
    } else {
      notify(
        event ? "Event updated successfully!" : "Event added successfully!",
        "success",
      );
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-heading">
          <div>
            <h2 id="modal-title">{event ? "Edit event" : "New event"}</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <CloseIcon sx={{ fontSize: 19 }} />
          </button>
        </div>
        <form onSubmit={submit} noValidate>
          <label className="field full">
            Event name
            <input
              autoFocus
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="e.g. Weekly safety briefing"
            />
          </label>
          <div className="field-grid">
            <label className="field">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => change("date", e.target.value)}
              />
            </label>
            <label className="field">
              Event type
              <select
                aria-label="Event type"
                value={form.type}
                onChange={(e) => change("type", e.target.value)}
              >
                {EVENT_TYPES.map((eventType) => (
                  <option key={eventType.value} value={eventType.value}>
                    {eventType.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Starts
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => change("startTime", e.target.value)}
              />
            </label>
            <label className="field">
              Ends
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => change("endTime", e.target.value)}
              />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            {event && onDelete && (
              <button
                type="button"
                className="button danger-ghost"
                onClick={() => {
                  onDelete();
                  notify("Event deleted successfully!", "success");
                }}
              >
                Delete event
              </button>
            )}
            <span className="action-spacer" />
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="button primary">
              {event ? "Save changes" : "Create event"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
