import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Authentication, Register } from '../modules/user';
import apiInstance from '../services/api';
import { badRequestError2, userAlreadyExistError } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Register Page Test', () => {
  it('form submission failed', async () => {
    apiInstance.post.mockImplementation(() => Promise.reject(badRequestError2));

    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </Authentication>
      )
    );

    const nameElement = screen.getByLabelText('Name');
    const emailElement = screen.getByLabelText('Email');
    const passwordElement = screen.getByLabelText('Password');
    const confirmPasswordElement = screen.getByLabelText('Confirm Password');
    const registerButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(nameElement, { target: { value: 'jn' } });
    fireEvent.change(emailElement, { target: { value: 'jn@example.com' } });
    fireEvent.change(passwordElement, { target: { value: 'pas' } });
    fireEvent.change(confirmPasswordElement, { target: { value: 'pas' } });

    expect(nameElement).toHaveValue('jn');
    expect(emailElement).toHaveValue('jn@example.com');
    expect(passwordElement).toHaveValue('pas');
    expect(confirmPasswordElement).toHaveValue('pas');

    fireEvent.click(registerButton);
    expect(
      await screen.findByText(
        '"name" length must be at least 3 characters long'
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Password must be at least 8 characters long')
    ).toBeInTheDocument();
  });

  it('form submission passed', async () => {
    apiInstance.post.mockImplementation(() => Promise.resolve({}));

    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </Authentication>
      )
    );

    const nameElement = screen.getByLabelText('Name');
    const emailElement = screen.getByLabelText('Email');
    const passwordElement = screen.getByLabelText('Password');
    const confirmPasswordElement = screen.getByLabelText('Confirm Password');
    const registerButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(nameElement, { target: { value: 'Test-User' } });
    fireEvent.change(emailElement, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordElement, {
      target: { value: 'test@123' },
    });
    fireEvent.change(confirmPasswordElement, {
      target: { value: 'test@123' },
    });

    expect(nameElement).toHaveValue('Test-User');
    expect(emailElement).toHaveValue('test@email.com');
    expect(passwordElement).toHaveValue('test@123');
    expect(confirmPasswordElement).toHaveValue('test@123');

    fireEvent.click(registerButton);

    expect(
      await screen.findByText(
        'User successfully registered. Redirecting to login page..'
      )
    ).toBeInTheDocument();
  });

  it('form submission failed due to user already exists', async () => {
    apiInstance.post.mockImplementation(() =>
      Promise.reject(userAlreadyExistError)
    );

    await act(async () =>
      render(
        <Authentication>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </Authentication>
      )
    );

    const nameElement = screen.getByLabelText('Name');
    const emailElement = screen.getByLabelText('Email');
    const passwordElement = screen.getByLabelText('Password');
    const confirmPasswordElement = screen.getByLabelText('Confirm Password');
    const registerButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(nameElement, { target: { value: 'Test-User' } });
    fireEvent.change(emailElement, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordElement, {
      target: { value: 'test@123' },
    });
    fireEvent.change(confirmPasswordElement, {
      target: { value: 'test@123' },
    });

    expect(nameElement).toHaveValue('Test-User');
    expect(emailElement).toHaveValue('test@email.com');
    expect(passwordElement).toHaveValue('test@123');
    expect(confirmPasswordElement).toHaveValue('test@123');

    fireEvent.click(registerButton);
    expect(await screen.findByText('User already exists!')).toBeInTheDocument();
  });
});
