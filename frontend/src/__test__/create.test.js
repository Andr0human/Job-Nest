import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense, act } from 'react';
import App from '../App';
import { Create as JobCreate } from '../modules/job';
import { MenuKey } from '../modules/navbar';
import { Authentication } from '../modules/user';
import apiInstance from '../services/api';
import { bulkUploadRecordDetail, bulkUploadRecords } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Create Page test', () => {
  it('Navigate to Single job create page when logged in', async () => {
    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText('Uploads')).toBeInTheDocument();
    });

    apiInstance.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          data: {
            email: 'test@email.com',
            _id: 'user-id-1',
          },
          message: 'User found!',
        },
      })
    );

    const uploadTab = screen.getByText('Uploads');
    fireEvent.click(uploadTab);

    await waitFor(async () => {
      expect(screen.getByText('Job Details')).toBeInTheDocument();
    });

    const bulkUploadElement = screen.getByText('Create Job');
    expect(bulkUploadElement).toBeInTheDocument();
  });

  it('Should be able to view history record in Bulk Upload', async () => {
    apiInstance.get.mockImplementationOnce(() =>
      Promise.resolve(bulkUploadRecords)
    );

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

    const bulkUploadElement = screen.getByText('Bulk Upload');
    expect(bulkUploadElement).toBeInTheDocument();

    fireEvent.click(bulkUploadElement);

    await waitFor(() => {
      expect(screen.getByText('Record ID - id-1'));
    });

    apiInstance.get.mockImplementationOnce(() =>
      Promise.reject(bulkUploadRecordDetail)
    );

    const viewButton = screen.getByTestId('view-button-0');
    expect(viewButton).toBeInTheDocument();

    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByText('createdAt')).toBeInTheDocument();
    });
  });

  it('Should be able to upload file with dragger', async () => {
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

    const bulkUploadElement = screen.getByText('Bulk Upload');
    expect(bulkUploadElement).toBeInTheDocument();

    fireEvent.click(bulkUploadElement);

    await waitFor(() =>
      expect(screen.getByText('Active Job Listings')).toBeInTheDocument()
    );

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    const dragger = document.querySelector('input[type="file"]');
    expect(dragger).toBeInTheDocument();
    fireEvent.change(dragger, { target: { files: [file] } });

    expect(dragger.files[0]).toStrictEqual(file);
  });

  it('Upload file with dragger failed', async () => {
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

    const bulkUploadElement = screen.getByText('Bulk Upload');
    expect(bulkUploadElement).toBeInTheDocument();

    fireEvent.click(bulkUploadElement);

    await waitFor(() =>
      expect(screen.getByText('Active Job Listings')).toBeInTheDocument()
    );

    const file = new File(['test'], 'test.csv', { type: 'file/csv' });

    const dragger = document.querySelector('input[type="file"]');
    expect(dragger).toBeInTheDocument();
    fireEvent.change(dragger, { target: { files: [file] } });

    expect(dragger.files[0]).toStrictEqual(file);
  });
});
