import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventModal from "./EventModal";

const props = {
  open: true,
  initialDate: "2026-06-22",
  eventTypes: ["meeting"],
  onClose: jest.fn(),
};

describe("EventModal", () => {
  it("shows validation errors and keeps the form open on a failed save", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn(() => "Add an event name.");
    render(<EventModal {...props} onClose={jest.fn()} onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: "Create event" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Add an event name.",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  it("converts the form date and times into the dataset datetime schema and closes after save", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSave = jest.fn(() => null);
    render(<EventModal {...props} onClose={onClose} onSave={onSave} />);
    await user.type(screen.getByLabelText("Event name"), "Team sync");
    await user.click(screen.getByRole("button", { name: "Create event" }));
    expect(onSave).toHaveBeenCalledWith({
      name: "Team sync",
      type: "meeting",
      startDate: "2026-06-22T09:00:00",
      endDate: "2026-06-22T10:00:00",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
