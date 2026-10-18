import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationProvider, useNotification } from "./NotificationProvider";

function TestComponent() {
  const { notify } = useNotification();

  return (
    <div>
      <button onClick={() => notify("Event added successfully!", "success")}>
        Show success
      </button>
      <button onClick={() => notify("Something went wrong.", "error")}>
        Show error
      </button>
    </div>
  );
}

describe("NotificationProvider", () => {
  it("displays a success notification", async () => {
    const user = userEvent.setup();

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Show success" }));

    expect(
      await screen.findByText("Event added successfully!"),
    ).toBeInTheDocument();
  });

  it("displays an error notification", async () => {
    const user = userEvent.setup();

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Show error" }));

    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();
  });

  it("closes a notification when the close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Show success" }));

    expect(
      await screen.findByText("Event added successfully!"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Event added successfully!"),
      ).not.toBeInTheDocument();
    });
  });
});
