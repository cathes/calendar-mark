
import { format } from "date-fns";
import type { CalendarEvent } from "../types";
import { iso, timeLabel, eventDate, typeClass } from "./dateUtils";

describe("iso", () => {
  it("formats a date as yyyy-MM-dd", () => {
    expect(iso(new Date(2026, 5, 22))).toBe("2026-06-22");
  });
});

describe("timeLabel", () => {
  it("formats morning times", () => {
    expect(timeLabel("2026-06-22T09:05:00")).toBe("9:05 AM");
  });

  it("formats afternoon times", () => {
    expect(timeLabel("2026-06-22T14:30:00")).toBe("2:30 PM");
  });

  it("formats midnight correctly", () => {
    expect(timeLabel("2026-06-22T00:00:00")).toBe("12:00 AM");
  });

  it("formats noon correctly", () => {
    expect(timeLabel("2026-06-22T12:00:00")).toBe("12:00 PM");
  });
});

describe("eventDate", () => {
  it("returns the date portion of the event start date", () => {
    const event: CalendarEvent = {
      id: "evt-001",
      type: "meeting",
      name: "Weekly safety briefing",
      startDate: "2026-06-22T09:00:00",
      endDate: "2026-06-22T09:30:00",
    };

    expect(eventDate(event)).toBe("2026-06-22");
  });
});

describe("typeClass", () => {
  it("converts event types to lowercase", () => {
    expect(typeClass("MEETING")).toBe("meeting");
  });

  it("replaces unsupported characters with hyphens", () => {
    expect(typeClass("Team Meeting!")).toBe("team-meeting-");
  });

  it("preserves hyphens and underscores", () => {
    expect(typeClass("team_meeting-1")).toBe("team_meeting-1");
  });
});
