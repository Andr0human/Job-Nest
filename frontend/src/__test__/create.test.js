import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React, { Suspense } from "react";
import App from "../App";
import { Create as JobCreate } from "../modules/job";
import { MenuKey } from "../modules/navbar";
import { Authentication } from "../modules/user";
import TestBulkUpload from "./TestBulkUpload";
import TestUser from "./TestUser";
import "./setupTests";

describe("Create Page test", () => {
  let testBulkUpload;
  let testUser;

  beforeAll(async () => {
    testBulkUpload = new TestBulkUpload();
    testUser = new TestUser();
  });

  beforeEach(async () => {
    await testBulkUpload.insertFakeEntry();
    await testUser.insertFakeEntry();
  });

  afterEach(async () => {
    // await testJobListing.deleteFakeEntry(testUser.token());
    await testUser.deleteFakeEntry();
  });

  test("Navigate to Single job create page when logged in", async () => {
    localStorage.setItem("token", testUser.token());
    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText("Uploads")).toBeInTheDocument();
    });

    const uploadTab = screen.getByText("Uploads");
    fireEvent.click(uploadTab);

    await waitFor(async () => {
      expect(screen.getByText("Job Details")).toBeInTheDocument();
    });

    const bulkUploadElement = screen.getByText("Create Job");
    expect(bulkUploadElement).toBeInTheDocument();
  });

  test("Should be able to view history record in Bulk Upload", async () => {
    localStorage.setItem("token", testUser.token());
    await act(async () =>
      render(
        <Suspense fallback={<>Loading...</>}>
          <Authentication>
            <MenuKey>
              <JobCreate />
            </MenuKey>
          </Authentication>
        </Suspense>
      )
    );

    const bulkUploadElement = screen.getByText("Bulk Upload");
    expect(bulkUploadElement).toBeInTheDocument();

    fireEvent.click(bulkUploadElement);

    await waitFor(() => {
      expect(screen.getByText(`Record ID - ${testBulkUpload.id()}`));
    });

    const viewButton = screen.getByTestId("view-button-0");
    expect(viewButton).toBeInTheDocument();

    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByText("createdAt")).toBeInTheDocument();
    });
  });

  test("Should be able to upload file with dragger", async () => {
    localStorage.setItem("token", testUser.token());
    await act(async () =>
      render(
        <Suspense fallback={<>Loading...</>}>
          <Authentication>
            <MenuKey>
              <JobCreate />
            </MenuKey>
          </Authentication>
        </Suspense>
      )
    );

    const bulkUploadElement = screen.getByText("Bulk Upload");
    expect(bulkUploadElement).toBeInTheDocument();

    fireEvent.click(bulkUploadElement);

    await waitFor(() =>
      expect(screen.getByText("Active Job Listings")).toBeInTheDocument()
    );

    const file = new File(["test"], "test.csv", { type: "text/csv" });

    const dragger = document.querySelector('input[type="file"]');
    expect(dragger).toBeInTheDocument();
    fireEvent.change(dragger, { target: { files: [file] } });

    expect(dragger.files[0]).toStrictEqual(file);
  });

  test("Upload file with dragger failed", async () => {
    localStorage.setItem("token", testUser.token());
    await act(async () =>
      render(
        <Suspense fallback={<>Loading...</>}>
          <Authentication>
            <MenuKey>
              <JobCreate />
            </MenuKey>
          </Authentication>
        </Suspense>
      )
    );

    const bulkUploadElement = screen.getByText("Bulk Upload");
    expect(bulkUploadElement).toBeInTheDocument();

    fireEvent.click(bulkUploadElement);

    await waitFor(() =>
      expect(screen.getByText("Active Job Listings")).toBeInTheDocument()
    );

    const file = new File(["test"], "test.csv", { type: "file/csv" });

    const dragger = document.querySelector('input[type="file"]');
    expect(dragger).toBeInTheDocument();
    fireEvent.change(dragger, { target: { files: [file] } });

    expect(dragger.files[0]).toStrictEqual(file);
  });
});
