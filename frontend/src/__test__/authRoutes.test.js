import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import App from "../App";
import TestUser from "./TestUser";
import "./setupTests";

describe("Auth Routes Test", () => {
  let testUser;

  beforeAll(() => {
    testUser = new TestUser();
  });

  beforeEach(async () => {
    await testUser.insertFakeEntry();
  });

  afterEach(async () => {
    await testUser.deleteFakeEntry();

    window.history.pushState({}, "", "/");
  });

  test("Navigate to Profile and then Login when not authenticated", async () => {
    await act(async () => render(<App />));

    // Wait for the initial rendering, we are in dashboard page
    await waitFor(() => {
      expect(screen.getByText("JobNest")).toBeInTheDocument();
    });

    // Find user icon and hover mouse over to
    // trigger the appearance of the profile menu item
    const userIcon = screen.getByTestId("user-icon");
    fireEvent.mouseEnter(userIcon);
    expect(await screen.findByText("Profile")).toBeInTheDocument();

    // Find and click the profile menu item
    const profileMenuItem = screen.getByText("Profile");
    fireEvent.click(profileMenuItem);

    // Wait for the navigation to complete. Since not authenticated,
    // login page will be rendered instead of profile page.
    await waitFor(() => {
      expect(screen.getByText("Sign in")).toBeInTheDocument();
    });
  });

  test("Navigate to Profile when authenticated", async () => {
    // Mock authentication by setting a token in localStorage
    localStorage.setItem("token", testUser.token());

    // Render the App component
    await act(async () => render(<App />));

    // Wait for the initial rendering, we are in the dashboard page
    await waitFor(() => {
      expect(screen.getByText("JobNest")).toBeInTheDocument();
    });

    // Find the user icon and hover the mouse over to
    // trigger the appearance of the profile menu item
    const userIcon = screen.getByTestId("user-icon");
    fireEvent.mouseEnter(userIcon);

    // Wait for the profile menu item to appear
    expect(await screen.findByText("Profile")).toBeInTheDocument();

    // Find and click the profile menu item
    const profileMenuItem = screen.getByText("Profile");
    fireEvent.click(profileMenuItem);

    // Wait for the navigation to complete and expect to be in the profile page
    await waitFor(() => {
      expect(screen.getByText("Profile Page")).toBeInTheDocument();
    });
  });

  test("Should logout successfully from dashboard page", async () => {
    // Mock authentication by setting a token in localStorage
    localStorage.setItem("token", testUser.token());

    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText("JobNest")).toBeInTheDocument();
    });

    // Find user icon and hover mouse over to
    // trigger the appearance of the logout menu item
    const userIcon = screen.getByTestId("user-icon");
    fireEvent.mouseEnter(userIcon);
    expect(await screen.findByText("Logout")).toBeInTheDocument();

    const logoutButton = screen.getByText("Logout");

    // Logout
    fireEvent.click(logoutButton);

    // Token should be deleted
    expect(localStorage.getItem('token') === null).toBeTruthy();
  });
});
