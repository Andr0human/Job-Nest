import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';

import App from '../App';
import apiInstance from '../services/api';

import { badRequestError, mockUser } from './mocks';
import './setupTests';

jest.mock('../services/api');

describe('Auth Routes Test', () => {
  it('Navigate to Profile and then Login when not authenticated', async () => {
    apiInstance.get.mockImplementation(() => Promise.reject(badRequestError));
    await act(async () => render(<App />));

    // Wait for the initial rendering, we are in dashboard page
    await waitFor(() => {
      expect(screen.getByText('Welcome to JobNest')).toBeInTheDocument();
    });

    // Find user icon and hover mouse over to
    // trigger the appearance of the profile menu item
    const userIcon = screen.getByTestId('user-icon');
    fireEvent.mouseEnter(userIcon);
    expect(await screen.findByText('My Profile')).toBeInTheDocument();

    // Find and click the profile menu item
    const profileMenuItem = screen.getByText('My Profile');
    fireEvent.click(profileMenuItem);

    // Wait for the navigation to complete. Since not authenticated,
    // login page will be rendered instead of profile page.
    await waitFor(() => {
      expect(screen.getByText('Sign in')).toBeInTheDocument();
    });
  });

  it('Navigate to Profile when authenticated', async () => {
    // Mock authentication by setting a token in localStorage
    localStorage.setItem('token', 'mock-token');
    apiInstance.get.mockImplementation(() => Promise.resolve(mockUser));

    // Render the App component
    await act(async () => render(<App />));

    // Wait for the initial rendering, we are in the dashboard page
    await waitFor(() => {
      expect(screen.getByText('Welcome to JobNest')).toBeInTheDocument();
    });

    // Find the user icon and hover the mouse over to
    // trigger the appearance of the profile menu item
    const userIcon = screen.getByTestId('user-icon');
    fireEvent.mouseEnter(userIcon);

    // Wait for the profile menu item to appear
    expect(await screen.findByText('My Profile')).toBeInTheDocument();

    // Find and click the profile menu item
    const profileMenuItem = screen.getByText('My Profile');
    fireEvent.click(profileMenuItem);

    // Wait for the navigation to complete and expect to be in the profile page
    await waitFor(() => {
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });
  });

  it('Should logout successfully from dashboard page', async () => {
    // Mock authentication by setting a token in localStorage
    localStorage.setItem('token', 'mock-token');

    await act(async () => render(<App />));

    await waitFor(async () => {
      expect(screen.getByText('Welcome to JobNest')).toBeInTheDocument();
    });

    // Find user icon and hover mouse over to
    // trigger the appearance of the logout menu item
    const userIcon = screen.getByTestId('user-icon');
    fireEvent.mouseEnter(userIcon);
    expect(await screen.findByText('Logout')).toBeInTheDocument();

    const logoutButton = screen.getByText('Logout');

    // Logout
    fireEvent.click(logoutButton);

    // Token should be deleted
    expect(localStorage.getItem('token') === null).toBeTruthy();
  });
});
