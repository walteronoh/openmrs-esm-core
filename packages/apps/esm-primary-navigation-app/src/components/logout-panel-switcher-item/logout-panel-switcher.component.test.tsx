import React from "react";
import { screen, render } from "@testing-library/react";
import LogoutPanelSwitcher from "./logout-panel-switcher.component";

const mockLogout = jest.fn();

describe("<LogoutPanelSwitcher/>", () => {
  beforeEach(() => {
    render(
      <LogoutPanelSwitcher onLogout={mockLogout} isLogoutEnabled={true} />
    );
  });

  it("should display logout button", async () => {
    const logoutButton = await screen.findByRole("button", { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });
});
