import { create } from "zustand";
import initialEvents from "../data/events.json";
import type { CalendarEvent, EventInput } from "../types";
import { validateEvent } from "../lib/eventValidation";

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (input: EventInput) => { ok: boolean; error?: string };
  updateEvent: (
    id: string,
    input: EventInput,
  ) => { ok: boolean; error?: string };
  deleteEvent: (id: string) => void;
}

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: initialEvents as CalendarEvent[],
  addEvent: (input) => {
    const error = validateEvent(input);
    if (error) return { ok: false, error };
    set((state) => ({
      events: [
        ...state.events,
        {
          ...input,
          name: input.name.trim(),
          type: input.type.trim(),
          id: makeId(),
        },
      ],
    }));
    return { ok: true };
  },
  updateEvent: (id, input) => {
    if (!get().events.some((event) => event.id === id))
      return { ok: false, error: "This event no longer exists." };
    const error = validateEvent(input);
    if (error) return { ok: false, error };
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? { ...input, name: input.name.trim(), type: input.type.trim(), id }
          : event,
      ),
    }));
    return { ok: true };
  },
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
}));
