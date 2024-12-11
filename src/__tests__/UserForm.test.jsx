import React from "react";
import { render, screen, waitFor } from '@testing-library/react'; // Import necessary functions for testing
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query'; // Import React Query hooks
import UserForm from "../components/UserForm"; // Import the UserForm component

// Create a new instance of QueryClient to pass to QueryClientProvider in the test
const queryClient = new QueryClient();

describe('UserForm Unit Test', () => {
  // Reset all mocks after each test to prevent side effects between tests
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays the user info in a form', async () => {
    // Mock user data that will be passed as the prefillData prop to the UserForm
    const mockUser = {
        userId: 1,
        username: 'johnd',
        password: 'example',
        isLoggedIn: true,
      };

    // Rendering the UserForm component wrapped in a QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <UserForm
            submitFunction={jest.fn()}  // Mocking the submit function
            prefillData={mockUser}  // Passing mock user data to prefill the form
            buttonMessage='Update'  // Setting the button text to "Update"
        />
      </QueryClientProvider>
    );

    // Getting the username input field by its label text
    const username = screen.getByLabelText(/username/i);
    // Assert that the username input field is pre-filled with 'johnd' as expected
    expect(username.value).toBe('johnd'); 

    // Getting the button with the text "Update"
    const updateButton = screen.getByText(/Update/i);
    // Assert that the "Update" button is rendered correctly
    expect(updateButton).toBeInTheDocument();
  });
});
