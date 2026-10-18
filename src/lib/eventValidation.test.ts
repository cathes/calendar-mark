import { validateEvent } from "./eventValidation";
import type { EventInput } from "../types";

const valid: EventInput = {
  name: "Planning",
  type: "meeting",
  startDate: "2026-06-22T09:00:00",
  endDate: "2026-06-22T10:00:00",
};

describe("validateEvent", () => {
  it("accepts a valid event using the dataset schema", () =>
    expect(validateEvent(valid)).toBeNull());
  it("rejects blank names", () => {
    expect(validateEvent({ ...valid, name: "" })).toBe("Add an event name.");
    expect(validateEvent({ ...valid, name: "   " })).toBe("Add an event name.");
  });
  it("rejects a blank type", () =>
    expect(validateEvent({ ...valid, type: " " })).toBe(
      "Choose an event type.",
    ));
  it("rejects impossible dates and malformed datetimes", () => {
    expect(validateEvent({ ...valid, startDate: "2026-02-30T09:00:00" })).toBe(
      "Choose valid start and end dates and times.",
    );
    expect(validateEvent({ ...valid, startDate: "not-a-date" })).toBe(
      "Choose valid start and end dates and times.",
    );
    expect(validateEvent({ ...valid, endDate: "2026-06-22T25:00:00" })).toBe(
      "Choose valid start and end dates and times.",
    );
  });
  it("rejects end date/time equal to or before the start", () => {
    expect(validateEvent({ ...valid, endDate: valid.startDate })).toBe(
      "End date and time must be later than the start.",
    );
    expect(validateEvent({ ...valid, endDate: "2026-06-22T08:59:00" })).toBe(
      "End date and time must be later than the start.",
    );
  });
  it("accepts an event ending on a later date", () =>
    expect(
      validateEvent({ ...valid, endDate: "2026-06-23T08:00:00" }),
    ).toBeNull());
});
