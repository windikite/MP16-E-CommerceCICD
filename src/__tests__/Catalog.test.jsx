import React from "react";
import { render, screen, waitFor } from '@testing-library/react'; // Importing necessary functions from testing-library
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query'; // Importing React Query client and hooks
import { fetchProducts, fetchProductsByCategory } from "../hooks/queries"; // Importing mock functions for data fetching
import Catalog from "../components/Catalog"; // Importing the Catalog component
import { MemoryRouter } from "react-router-dom"; // Importing MemoryRouter for routing in tests

// Mocking external modules to control the behavior of network requests and hooks
jest.mock('../hooks/queries', () => ({
    fetchProductsByCategory: jest.fn(),
    fetchProducts: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'), // Retaining the actual React Query functions but mocking specific ones
    useInfiniteQuery: jest.fn(), // Mocking useInfiniteQuery hook from React Query
}));

// Setting up a QueryClient for React Query
const queryClient = new QueryClient();

describe('Catalog Integration Test', () => {
  // Resetting all mocks after each test to avoid state carryover
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches products and displays them', async () => {
    // Mocking the fetchProducts and fetchProductsByCategory functions to return fake product data
    fetchProducts.mockResolvedValue([
        {
            id:1,
            title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", // Example product
            price:109.95,
            description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category:"men's clothing",
            image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating:{rate:3.9,count:120}
        }
    ]);

    // Similarly, mocking fetchProductsByCategory to return the same product data (assuming testing of category-based fetch)
    fetchProductsByCategory.mockResolvedValue([
        {
            id:1,
            title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", // Example product
            price:109.95,
            description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category:"men's clothing",
            image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating:{rate:3.9,count:120}
        }
    ]);

    // Mocking the behavior of the useInfiniteQuery hook to simulate fetching paginated data
    useInfiniteQuery.mockReturnValue({
        data: {
            pages: [ // Simulated response data for the first page of products
                {
                    id:1,
                    title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                    price:109.95,
                    description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                    category:"men's clothing",
                    image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                    rating:{rate:3.9,count:120}
                }
            ],
            pageParams: [1], // Indicating that this is the first page of data
        },
        isLoading: false, // Indicating that loading is complete
        isError: false, // No errors encountered
        isSuccess: true, // The request was successful
        isFetching: false, // Not currently fetching more data
        fetchNextPage: jest.fn(), // Mocking the function to fetch the next page (not used here but could be in the actual component)
        hasNextPage: true, // Indicating that there is a next page of data
    });

    // Rendering the Catalog component wrapped with necessary providers (QueryClientProvider and MemoryRouter)
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <Catalog />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Using waitFor to wait until the product is displayed on the screen
    // We are waiting for the text 'Fjallraven' to appear in the document
    await waitFor(() => screen.getByText(/Fjallraven/i)); 

    // After waiting, we assert that the product name 'Fjallraven' is in the document
    const element = screen.getByText(/Fjallraven/i);
    expect(element).toBeInTheDocument(); // Verifying that the element is rendered on the screen
  });
});
