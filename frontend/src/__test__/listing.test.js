import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { View as JobView } from "../modules/job";
import { Listing } from "../modules/job/Listing";
import { Authentication } from "../modules/user";
import TestJobListing from "./TestJobListing";
import TestUser from "./TestUser";
import "./setupTests";

describe("Listing page Test", () => {
  let testJobListing;
  let testUser;

  beforeAll(() => {
    testJobListing = new TestJobListing();
    testUser = new TestUser();
  });

  beforeEach(async () => {
    await testJobListing.insertFakeEntry();
    await testUser.insertFakeEntry();
  });

  afterEach(async () => {
    await testJobListing.deleteFakeEntry(testUser.token());
    await testUser.deleteFakeEntry();

    window.history.pushState({}, "", "/");
  });

  test("SearchBar test", async () => {
    await act(async () =>
      render(
        <BrowserRouter>
          <Authentication>
            <Listing />
          </Authentication>
        </BrowserRouter>
      )
    );

    const searchBar = screen.getByPlaceholderText("Search jobs by Title...");
    expect(searchBar).toBeInTheDocument();

    fireEvent.change(searchBar, { target: { value: "some filter" } });
    expect(searchBar).toHaveValue("some filter");

    const searchButton = screen.getByRole("button", { name: "Find Jobs" });
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);
  });

  test("Filters test", async () => {
    await act(async () =>
      render(
        <BrowserRouter>
          <Authentication>
            <Listing />
          </Authentication>
        </BrowserRouter>
      )
    );

    const applyButton = screen.getByText("Apply Filters");
    expect(applyButton).toBeInTheDocument();

    const resetButton = screen.getByText("Reset Filters");
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(applyButton);
    fireEvent.click(resetButton);
  });

  test("Navigate to view page (success)", async () => {
    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText(testJobListing.title())).toBeInTheDocument();
    });

    const viewButton = screen.getByTestId("view-button-0");
    expect(viewButton).toBeInTheDocument();

    fireEvent.click(viewButton);
    expect(window.location.pathname).toBe(`/jobs/${testJobListing.id()}`);

    await waitFor(() => {
      const title = testJobListing.title() + " (Test Company)";
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("Navigate to view page (failure)", async () => {
    const targetUrl = `/jobs/${testJobListing.id()} - 2`;
    await act(async () =>
      render(
        <MemoryRouter initialEntries={[targetUrl]}>
          <Routes>
            <Route path="/jobs/:jobId" element={<JobView />} />
          </Routes>
        </MemoryRouter>
      )
    );

    await waitFor(() => {
      const title = "Sorry, the page you are looking for does not exist.";
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("Should be able to edit job listing", async () => {
    localStorage.setItem("token", testUser.token());
    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText(testJobListing.title())).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("edit-button-0");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(window.location.pathname).toBe(`/edit/${testJobListing.id()}`);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Title...")).toHaveValue(
        testJobListing.title()
      );
    });

    const contactElement = screen.getByPlaceholderText("Contact Email...");
    expect(contactElement).toHaveValue("test@company.com");

    fireEvent.change(contactElement, {
      target: { value: "test-2@company.com" },
    });

    fireEvent.submit(screen.getByText("Update Job"));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/dashboard");
    });
  });

  test("Should be able to delete job listing", async () => {
    localStorage.setItem("token", testUser.token());
    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText(testJobListing.title())).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("delete-button-0");
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(screen.getByText("Are you sure to delete this job-listing?"));

    const yesButton = screen.getByRole("button", { name: "Yes" });
    fireEvent.click(yesButton);
  });
});
