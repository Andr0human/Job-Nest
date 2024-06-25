import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticationContext, Profile } from '../modules/user';
import apiInstance from '../services/api';
import { profileData } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Profile Test', () => {
  it('Should update summary text', async () => {
    apiInstance.get.mockImplementation(() => Promise.resolve(profileData));

    const authData = {
      userId: 'Test-User',
      email: 'test@email.com',
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
      const emailElement = screen.getByLabelText('Email');
      expect(emailElement).toHaveValue('test@email.com');
    });

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    const summaryElement = screen.getByRole('textbox', { name: 'Summary' });
    expect(summaryElement).toBeInTheDocument();

    fireEvent.input(summaryElement, {
      target: { value: 'Hello I am test user' },
    });

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    expect(summaryElement).toHaveValue('Hello I am test user');

    fireEvent.input(summaryElement, {
      target: { value: 'Hello my second text' },
    });

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
  });

  it('Should delete user account', async () => {
    apiInstance.get.mockImplementation(() => Promise.resolve(profileData));

    const authData = {
      userId: 'Test-User',
      email: 'test@email.com',
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
      const emailElement = screen.getByLabelText('Email');
      expect(emailElement).toHaveValue('test@email.com');
    });

    apiInstance.delete.mockImplementation(() => Promise.resolve({}));

    const deleteButton = screen.getByRole('button', { name: 'Delete Account' });
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    expect(
      await screen.findByText(
        'Account successfully deleted. Redirecting to Dashboard page..'
      )
    ).toBeInTheDocument();
  });
});
