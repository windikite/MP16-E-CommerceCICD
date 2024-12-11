import React from "react";
import { render, screen, waitFor } from '@testing-library/react'; // Import necessary testing functions
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import React Query context provider
import { fetchUser } from "../hooks/queries"; // Import the fetchUser function to mock it
import { StateProvider } from '../StateProvider'; // Import the StateProvider to manage global state
import ViewUser from '../components/ViewUser'; // Import the component to be tested

// Mock the fetchUser function to return fake user data during the test
jest.mock('../hooks/queries', () => ({
  fetchUser: jest.fn(),
}));

// Mock useNavigate from react-router-dom, as it's used inside ViewUser component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Create a new instance of QueryClient to pass to QueryClientProvider in the test
const queryClient = new QueryClient();

describe('View User Integration Test', () => {
  // Reset mocks after each test to ensure clean state for the next test
  afterEach(() => {
    jest.resetAllMocks(); 
  });

  it('fetches the user and displays their data', async () => {
    // Mock the fetchUser function to resolve with fake user data when called
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

    // Mock the user state context to simulate a logged-in user
    const mockUser = {
      userId: 1,
      username: 'johnd',
      isLoggedIn: true,
    };

    // Mock the useContext hook to return the mockUser object when used
    jest.spyOn(React, 'useContext').mockReturnValue(mockUser);

    // Render the ViewUser component wrapped in necessary providers
    render(
      <QueryClientProvider client={queryClient}>
        <StateProvider>
          <ViewUser />
        </StateProvider>
      </QueryClientProvider>
    );

    // Assert that the "loading..." text appears while the user data is being fetched
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    // Wait for the component to finish rendering the user data
    await waitFor(() => screen.getByText(/johnd/i)); // Wait for the username to appear in the document

    // Assert that the username is displayed in the document once it has been fetched
    const usernameElement = screen.getByText(/johnd/i);
    expect(usernameElement).toBeInTheDocument();
  });
});
