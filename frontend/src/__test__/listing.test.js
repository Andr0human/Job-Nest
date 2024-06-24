import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import { View as JobView } from '../modules/job';
import { Listing } from '../modules/job/Listing';
import { Authentication } from '../modules/user';
import apiInstance from '../services/api';
import { jobDetail, jobsData } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Listing page Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    window.history.pushState({}, '', '/');
  });

  it.only('SearchBar test', async () => {
    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobsData));

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

    fireEvent.change(searchBar, { target: { value: 'some filter' } });
    expect(searchBar).toHaveValue('some filter');

    const searchButton = screen.getByRole('button', { name: 'Find Jobs' });
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);
  });

  it('Filters test', async () => {
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
  });

  it('Navigate to view page (success)', async () => {
    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobsData));

    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText('Test Title - 1')).toBeInTheDocument();
    });

    const viewButton = screen.getByTestId('view-button-0');
    expect(viewButton).toBeInTheDocument();

    fireEvent.click(viewButton);
    expect(window.location.pathname).toBe('/jobs/id-1');

    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobDetail));

    await waitFor(() => {
      expect(screen.getByText('Test Title - 1')).toBeInTheDocument();
    });
  });

  it('Navigate to view page (failure)', async () => {
    const targetUrl = '/jobs/id-abc';
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
      const title = 'Sorry, the page you are looking for does not exist.';
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('Should be able to edit job listing', async () => {
    localStorage.setItem('token', 'mock-token');
    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobsData));
    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText('Test Title - 1')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-button-0');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(window.location.pathname).toBe('/edit/id-1');

    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobDetail));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title...')).toHaveValue(
        'Test Title - 1'
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
    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobsData));
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
