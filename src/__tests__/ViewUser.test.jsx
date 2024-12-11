import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchUser } from "../hooks/queries";
import { StateProvider } from '../StateProvider';
import ViewUser from '../components/ViewUser';

jest.mock('../hooks/queries', () => ({
  fetchUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const queryClient = new QueryClient();

describe('View User Integration Test', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks after each test
  });

  it('fetches the user and displays their data', async () => {
    // Mock the fetchUser function to return fake user data
    fetchUser.mockResolvedValue({
      email: 'John@gmail.com',
      username: 'johnd',
      password: 'm38rmF$',
      name: {
        firstname: 'John',
        lastname: 'Doe',
      },
      address: {
        city: 'kilcoole',
        street: '7835 new road',
        number: 3,
        zipcode: '12926-3874',
        geolocation: {
          lat: '-37.3159',
          long: '81.1496',
        },
      },
      phone: '1-570-236-7033',
    });

    // Mock the state context to return a valid user object
    const mockUser = {
      userId: 1,
      username: 'johnd',
      isLoggedIn: true,
    };

    // Mock useContext to return the mockUser object
    jest.spyOn(React, 'useContext').mockReturnValue(mockUser);

    render(
      <QueryClientProvider client={queryClient}>
        <StateProvider>
          <ViewUser />
        </StateProvider>
      </QueryClientProvider>
    );

    // First check for the loading state to confirm that the data is being fetched
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    // Wait for the component to finish rendering the user data
    await waitFor(() => screen.getByText(/johnd/i)); // Wait until the username appears

    // Assert that the username is in the document once it's rendered
    const usernameElement = screen.getByText(/johnd/i);
    expect(usernameElement).toBeInTheDocument();
  });
});
