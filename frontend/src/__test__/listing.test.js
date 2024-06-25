import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import { View as JobView } from '../modules/job';
import { Listing } from '../modules/job/Listing';
import { Authentication } from '../modules/user';
import apiInstance from '../services/api';
import { jobDetail, jobNotFoundError, jobsData, mockUser } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Listing page Test', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    window.history.pushState({}, '', '/');
  });

  it('SearchBar test', async () => {
    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve(jobsData))
      .mockImplementationOnce(() => Promise.resolve(jobsData));

    await act(async () =>
      render(
        <BrowserRouter>
          <Authentication>
            <Listing />
          </Authentication>
        </BrowserRouter>
      )
    );

    const searchBar = screen.getByPlaceholderText('Search jobs by Title...');
    expect(searchBar).toBeInTheDocument();

    fireEvent.change(searchBar, { target: { value: 'Test Company' } });
    expect(searchBar).toHaveValue('Test Company');

    const searchButton = screen.getByRole('button', { name: 'Find Jobs' });
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Test Title - 1')).toBeInTheDocument();
    });
  });

  it('Filters test', async () => {
    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve(jobsData))
      .mockImplementationOnce(() => Promise.resolve(jobsData))
      .mockImplementationOnce(() => Promise.resolve(jobsData));

    await act(async () =>
      render(
        <BrowserRouter>
          <Authentication>
            <Listing />
          </Authentication>
        </BrowserRouter>
      )
    );

    const applyButton = screen.getByText('Apply Filters');
    expect(applyButton).toBeInTheDocument();

    const resetButton = screen.getByText('Reset Filters');
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(applyButton);
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('Test Title - 1')).toBeInTheDocument();
    });
  });

  it('Navigate to view page (success)', async () => {
    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(jobsData))
      .mockImplementationOnce(() => Promise.resolve(jobDetail));

    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText(jobDetail.data.data.title)).toBeInTheDocument();
    });

    const viewButton = screen.getByTestId('view-button-0');
    expect(viewButton).toBeInTheDocument();

    fireEvent.click(viewButton);
    expect(window.location.pathname).toBe(`/jobs/${jobDetail.data.data._id}`);

    await waitFor(() => {
      expect(screen.getByText(jobDetail.data.data.title)).toBeInTheDocument();
    });
  });

  it('Navigate to view page (failure)', async () => {
    const mockJobId = 'abcdef123456abcdef123456';
    const targetUrl = `/jobs/${mockJobId}`;

    apiInstance.get.mockImplementationOnce(() =>
      Promise.reject(jobNotFoundError)
    );

    await act(async () =>
      render(
        <MemoryRouter initialEntries={[targetUrl]}>
          <Routes>
            <Route path='/jobs/:jobId' element={<JobView />} />
          </Routes>
        </MemoryRouter>
      )
    );

    await waitFor(() => {
      const title = 'Sorry, the page you are looking for does not exist.';
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('Should be able to edit job listing', async () => {
    localStorage.setItem('token', 'mock-token');

    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(jobsData))
      .mockImplementationOnce(() => Promise.resolve(jobDetail));

    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText(jobDetail.data.data.title)).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-button-0');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(window.location.pathname).toBe(`/edit/${jobDetail.data.data._id}`);

    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobDetail));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title...')).toHaveValue(
        jobDetail.data.data.title
      );
    });

    const contactElement = screen.getByPlaceholderText('Contact Email...');
    expect(contactElement).toHaveValue('test@company.com');

    fireEvent.change(contactElement, {
      target: { value: 'test-2@company.com' },
    });

    apiInstance.get.mockImplementationOnce(() =>
      Promise.resolve({
        ...jobsData.data.data.data[0],
        contactEmail: 'test-2@company.com',
      })
    );

    fireEvent.submit(screen.getByText('Update Job'));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  it('Should be able to delete job listing', async () => {
    localStorage.setItem('token', 'mock-token');

    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(jobsData));

    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText('Test Title - 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-button-0');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    expect(screen.getByText('Are you sure to delete this job-listing?'));

    const yesButton = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(yesButton);
  });
});
