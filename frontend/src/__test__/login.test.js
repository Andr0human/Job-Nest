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
import { Authentication, Login } from "../modules/user";
import TestUser from "./TestUser";
import "./setupTests";

describe("Login Page Test", () => {
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

  test("form submission failed", async () => {
    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Authentication>
      )
    );

    const emailElement = screen.getByLabelText("Email");
    const passwordElement = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Log in" });

    fireEvent.change(emailElement, { target: { value: "jn@example.com" } });
    fireEvent.change(passwordElement, { target: { value: "jnjn_pass" } });

    expect(emailElement).toHaveValue("jn@example.com");
    expect(passwordElement).toHaveValue("jnjn_pass");

    fireEvent.click(loginButton);
    expect(
      await screen.findByText("no user found for current email!")
    ).toBeInTheDocument();
  });

  test("form submission passed", async () => {
    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Authentication>
      )
    );

    const emailElement = screen.getByLabelText("Email");
    const passwordElement = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Log in" });

    fireEvent.change(emailElement, { target: { value: testUser.email() } });
    fireEvent.change(passwordElement, {
      target: { value: testUser.password() },
    });

    expect(emailElement).toHaveValue(testUser.email());
    expect(passwordElement).toHaveValue(testUser.password());

    fireEvent.click(loginButton);
    expect(
      await screen.findByText(
        "Login successful. Redirecting to Dashboard page.."
      )
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});
