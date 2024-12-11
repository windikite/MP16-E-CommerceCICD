import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductsByCategory } from "../hooks/queries";
import Catalog from "../components/Catalog";
import { MemoryRouter } from "react-router-dom";

jest.mock('../hooks/queries', () => ({
    fetchProductsByCategory: jest.fn(),
    fetchProducts: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useInfiniteQuery: jest.fn(),
}));

const queryClient = new QueryClient();

describe('Catalog Integration Test', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks after each test
  });

  it('fetches products and displays them', async () => {
    // Mock the fetchUser function to return fake user data
    fetchProducts.mockResolvedValue([
        {
            id:1,
            title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price:109.95,
            description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",category:"men's clothing",
            image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating:{rate:3.9,count:120}
        }
    ]);

    fetchProductsByCategory.mockResolvedValue([
        {
            id:1,
            title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price:109.95,
            description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",category:"men's clothing",
            image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating:{rate:3.9,count:120}
        }
    ]);

    useInfiniteQuery.mockReturnValue({
        data: {
            pages: [
                {
                    id:1,
                    title:"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                    price:109.95,
                    description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",category:"men's clothing",
                    image:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                    rating:{rate:3.9,count:120}
                }
            ],
            pageParams: [1],
        },
        isLoading: false,
        isError: false,
        isSuccess: true,
        isFetching: false,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <Catalog />
        </MemoryRouter>
        
      </QueryClientProvider>
    );


    // Wait for the component to finish rendering the user data
    await waitFor(() => screen.getByText(/Fjallraven/i)); // Wait until the username appears

    // Assert that the username is in the document once it's rendered
    const element = screen.getByText(/Fjallraven/i);
    expect(element).toBeInTheDocument();
  });
});
