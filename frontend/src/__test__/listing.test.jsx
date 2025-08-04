/* eslint-disable no-underscore-dangle */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act, Suspense } from 'react';
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
    localStorage.clear();
  });

  afterEach(async () => {
    window.history.pushState({}, '', '/');
  });

  it('SearchBar test', async () => {
    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve(jobsData));

    await act(async () =>
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Authentication>
              <Listing />
            </Authentication>
          </BrowserRouter>
        </Suspense>,
      ),
    );

    const searchBar = screen.getByPlaceholderText(
      'Search jobs, companies, or locations...',
    );
    expect(searchBar).toBeInTheDocument();

    fireEvent.change(searchBar, { target: { value: 'Test Company' } });
    expect(searchBar).toHaveValue('Test Company');

    const searchButton = screen.getByRole('button', {
      name: 'search Find Jobs',
    });
    expect(searchButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(searchButton);
    });

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
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Authentication>
              <Listing />
            </Authentication>
          </BrowserRouter>
        </Suspense>,
      ),
    );

    const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
    expect(applyButton).toBeInTheDocument();

    const resetButton = screen.getByRole('button', {
      name: 'reload Reset All',
    });
    expect(resetButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(applyButton);
    });

    await act(async () => {
      fireEvent.click(resetButton);
    });

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

    await waitFor(() => {
      expect(screen.getByText('Welcome to JobNest')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Find Jobs'));
    });

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: jobDetail.data.data.title }),
      ).toBeInTheDocument();
    });

    const viewButton = screen.getByTestId('view-button-0');
    expect(viewButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(viewButton);
    });
    expect(window.location.pathname).toBe(`/jobs/${jobDetail.data.data._id}`);

    const { title, company } = jobDetail.data.data;
    await waitFor(() => {
      expect(screen.getByText(`${title} (${company})`)).toBeInTheDocument();
    });
  });

  it('Navigate to view page (failure)', async () => {
    const mockJobId = 'abcdef123456abcdef123456';
    const targetUrl = `/jobs/${mockJobId}`;

    apiInstance.get.mockImplementationOnce(() =>
      Promise.reject(jobNotFoundError),
    );

    await act(async () =>
      render(
        <MemoryRouter initialEntries={[targetUrl]}>
          <Routes>
            <Route path='/jobs/:jobId' element={<JobView />} />
          </Routes>
        </MemoryRouter>,
      ),
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
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(jobDetail));

    await act(async () => render(<App />));

    await waitFor(() => {
      expect(screen.getByText('Welcome to JobNest')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Find Jobs'));
    });

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: jobDetail.data.data.title }),
      ).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-button-0');
    expect(editButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(window.location.pathname).toBe(`/edit/${jobDetail.data.data._id}`);

    apiInstance.get.mockImplementationOnce(() => Promise.resolve(jobDetail));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('e.g. Senior Frontend Developer'),
      ).toHaveValue(jobDetail.data.data.title);
    });
  });

  it('Should be able to delete job listing', async () => {
    localStorage.setItem('token', 'mock-token');

    apiInstance.get
      .mockImplementationOnce(() => Promise.resolve(mockUser))
      .mockImplementationOnce(() => Promise.resolve(jobsData));

    await act(async () => render(<App />));

    await waitFor(() => {
      expect(screen.getByText('Welcome to JobNest')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Find Jobs'));
    });

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: jobDetail.data.data.title }),
      ).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-button-0');
    expect(deleteButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(deleteButton);
    });
    expect(screen.getByText('Delete this job listing?'));

    const yesButton = screen.getByRole('button', { name: 'Delete' });
    await act(async () => {
      fireEvent.click(yesButton);
    });
  });
});
