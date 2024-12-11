import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import UserForm from "../components/UserForm";

const queryClient = new QueryClient();

describe('UserForm Unit Test', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks after each test
  });

  it('displays the user info in a form', async () => {
    const mockUser = {
        userId: 1,
        username: 'johnd',
        password: 'example',
        isLoggedIn: true,
      };

    render(
      <QueryClientProvider client={queryClient}>
        <UserForm
            submitFunction={jest.fn()}
            prefillData={mockUser}
            buttonMessage='Update'
        />
      </QueryClientProvider>
    );
    const username = screen.getByLabelText(/username/i);
    expect(username.value).toBe('johnd'); 

    const updateButton = screen.getByText(/Update/i);
    expect(updateButton).toBeInTheDocument();
  });
});
