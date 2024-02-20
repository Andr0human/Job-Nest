import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Authentication, Register } from "../modules/user";
import TestUser from "./TestUser";
import "./setupTests";
import { act } from "react-dom/test-utils";

describe("Register Page Test", () => {
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
            <Register />
          </BrowserRouter>
        </Authentication>
      )
    );

    const nameElement = screen.getByLabelText("Name");
    const emailElement = screen.getByLabelText("Email");
    const passwordElement = screen.getByLabelText("Password");
    const confirmPasswordElement = screen.getByLabelText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(nameElement, { target: { value: "jn" } });
    fireEvent.change(emailElement, { target: { value: "jn@example.com" } });
    fireEvent.change(passwordElement, { target: { value: "pas" } });
    fireEvent.change(confirmPasswordElement, { target: { value: "pas" } });

    expect(nameElement).toHaveValue("jn");
    expect(emailElement).toHaveValue("jn@example.com");
    expect(passwordElement).toHaveValue("pas");
    expect(confirmPasswordElement).toHaveValue("pas");

    fireEvent.click(registerButton);
    expect(
      await screen.findByText(
        '"name" length must be at least 3 characters long'
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password must be at least 8 characters long")
    ).toBeInTheDocument();
  });

  test("form submission passed", async () => {
    await testUser.deleteFakeEntry();

    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </Authentication>
      )
    );

    const nameElement = screen.getByLabelText("Name");
    const emailElement = screen.getByLabelText("Email");
    const passwordElement = screen.getByLabelText("Password");
    const confirmPasswordElement = screen.getByLabelText("Confirm Password");
    const registerButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(nameElement, { target: { value: testUser.name() } });
    fireEvent.change(emailElement, { target: { value: testUser.email() } });
    fireEvent.change(passwordElement, {
      target: { value: testUser.password() },
    });
    fireEvent.change(confirmPasswordElement, {
      target: { value: testUser.password() },
    });

    expect(nameElement).toHaveValue(testUser.name());
    expect(emailElement).toHaveValue(testUser.email());
    expect(passwordElement).toHaveValue(testUser.password());
    expect(confirmPasswordElement).toHaveValue(testUser.password());

    fireEvent.click(registerButton);

    expect(
      await screen.findByText(
        "User successfully registered. Redirecting to login page.."
      )
    ).toBeInTheDocument();

    fireEvent.click(registerButton);
    expect(await screen.findByText("User already exists!")).toBeInTheDocument();
  });
});
