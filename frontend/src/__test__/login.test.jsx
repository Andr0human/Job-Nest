import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Authentication, Login } from '../modules/user';
import apiInstance from '../services/api';

import { successfulLogin, userNotFoundError } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Login Page Test', () => {
  it('form submission failed', async () => {
    apiInstance.post.mockImplementation(() =>
      Promise.reject(userNotFoundError),
    );

    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Authentication>,
      ),
    );

    const emailElement = screen.getByLabelText('Email');
    const passwordElement = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailElement, { target: { value: 'jn@example.com' } });
    fireEvent.change(passwordElement, { target: { value: 'jnjn_pass' } });

    expect(emailElement).toHaveValue('jn@example.com');
    expect(passwordElement).toHaveValue('jnjn_pass');

    fireEvent.click(loginButton);
    expect(
      await screen.findByText('no user found for current email!'),
    ).toBeInTheDocument();
  });

  it('form submission passed', async () => {
    apiInstance.post.mockImplementation(() => Promise.resolve(successfulLogin));

    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Authentication>,
      ),
    );

    const emailElement = screen.getByLabelText('Email');
    const passwordElement = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailElement, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordElement, {
      target: { value: 'test@123' },
    });

    expect(emailElement).toHaveValue('test@email.com');
    expect(passwordElement).toHaveValue('test@123');

    fireEvent.click(loginButton);
    expect(
      await screen.findByText(
        'Login successful. Redirecting to Dashboard page..',
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
