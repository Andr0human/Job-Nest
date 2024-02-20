import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthenticationContext, Profile } from "../modules/user";
import TestUser from "./TestUser";
import "./setupTests";

describe("Profile Test", () => {
  let testUser;

  beforeAll(() => {
    testUser = new TestUser();
  });

  beforeEach(async () => {
    await testUser.insertFakeEntry();
  });

  afterEach(async () => {
    await testUser.deleteFakeEntry();
  });

  test("Should update summary text", async () => {
    localStorage.setItem("token", testUser.token());
    const authData = {
      userId: testUser.userId(),
      email: testUser.email(),
    };

    await act(async () => {
      render(
        <BrowserRouter>
          <AuthenticationContext.Provider value={{ authData }}>
            <Profile />
          </AuthenticationContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(async () => {
      const emailElement = screen.getByLabelText("Email");
      expect(emailElement).toHaveValue(testUser.email());
    });

    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    const summaryElement = screen.getByRole("textbox", { name: "Summary" });
    expect(summaryElement).toBeInTheDocument();

    fireEvent.input(summaryElement, {
      target: { value: "Hello I am test user" },
    });

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    expect(summaryElement).toHaveValue("Hello I am test user");

    fireEvent.input(summaryElement, {
      target: { value: "Hello my second text" },
    });

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
  });

  test("Should delete user account", async () => {
    localStorage.setItem("token", testUser.token());
    const authData = {
      userId: testUser.userId(),
      email: testUser.email(),
    };

    await act(async () => {
      render(
        <BrowserRouter>
          <AuthenticationContext.Provider value={{ authData }}>
            <Profile />
          </AuthenticationContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      const emailElement = screen.getByLabelText("Email");
      expect(emailElement).toHaveValue(testUser.email());
    });

    const deleteButton = screen.getByRole("button", { name: "Delete Account" });
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    expect(
      await screen.findByText(
        "Account successfully deleted. Redirecting to Dashboard page.."
      )
    ).toBeInTheDocument();
  });
});
