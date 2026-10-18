import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MiniCalendar from "./MiniCalendar";
import type { CalendarEvent } from "../types";

describe("MiniCalendar", () => {
  const selectedDate = new Date(2026, 5, 22); // June 22, 2026

  const events: CalendarEvent[] = [
    {
      id: "evt-001",
      type: "meeting",
      name: "Weekly safety briefing",
      startDate: "2026-06-22T09:00:00",
      endDate: "2026-06-22T09:30:00",
    },
  ];

  const setup = (overrides = {}) => {
    const onPick = jest.fn();

    render(
      <MiniCalendar
        date={selectedDate}
        events={events}
        onPick={onPick}
        {...overrides}
      />,
    );

    return { onPick };
  };

  it("renders the weekday headings", () => {
    setup();

    for (const day of ["M", "T", "W", "T", "F", "S", "S"]) {
      expect(screen.getAllByText(day).length).toBeGreaterThan(0);
    }
  });

  it("renders the days of the selected month", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "June 22, 2026" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "June 30, 2026" }),
    ).toBeInTheDocument();
  });

  it("calls onPick when a date is selected", async () => {
    const user = userEvent.setup();
    const { onPick } = setup();

    await user.click(screen.getByRole("button", { name: "June 23, 2026" }));

    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onPick).toHaveBeenCalledWith(new Date(2026, 5, 23));
  });

  it("renders a date button for a day containing an event", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "June 22, 2026" }),
    ).toBeInTheDocument();
  });

  it("renders all 42 calendar day buttons", () => {
    setup();

    expect(screen.getAllByRole("button")).toHaveLength(42);
  });
});
