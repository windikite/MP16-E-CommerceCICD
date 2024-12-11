// Import necessary components and hooks from libraries and local modules
import { fetchProducts, fetchProductsByCategory } from '../hooks/queries';  // Fetch product data from API
import { Button, Container, Spinner, Alert, Dropdown } from 'react-bootstrap';  // Bootstrap UI components
import React, { useState, useEffect } from 'react';  // React hooks for state management
import ProductCard from './ProductCard';  // Component to display individual products
import { useParams } from 'react-router-dom';  // Hook to access route parameters
import { useInfiniteQuery } from '@tanstack/react-query';  // Hook for infinite scrolling query
import { useTranslation } from "react-i18next";  // Hook for i18n translation support

function Catalog() {
    const { category } = useParams();  // Get category from URL parameters
    const [sortOrder, setSortOrder] = useState('asc');  // State for sorting order (ascending or descending)
    const { t, i18n } = useTranslation();  // Initialize translation

    // Function to fetch data with pagination and sorting
    const handleFetch = ({ pageParam = 1 }) => {
        return category
            ? fetchProductsByCategory(category, pageParam, 50, sortOrder)  // Fetch products by category with pagination and sorting
            : fetchProducts({ pageParam, sortOrder });  // Fetch all products with pagination and sorting
    };

    // Infinite Query for fetching products
    const {
        data,
        isLoading,
        isError,
        isSuccess,
        isFetching,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['products', category, sortOrder],  // Query key with category and sort order as dependencies
        queryFn: handleFetch,  // Function to fetch data
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;  // Determine next page
            return nextPage <= 5 ? nextPage : undefined;  // Limit to 5 pages for example
        },
    });

    const [allProducts, setAllProducts] = useState([]);  // State to store all fetched products

    useEffect(() => {
        if (data) {
            const products = data.pages.flat();  // Flatten paginated product data
            setAllProducts(products);  // Set flattened products to state
        }
    }, [data]);

    // Loading state, show a spinner if data is loading
    if (isLoading) {
        return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    }

    // Error state, show an error message if there is a failure
    if (isError) {
        return <Alert variant="danger">Error fetching data</Alert>;
    }

    // Handle sorting order change
    const handleSortOrderChange = (newSortOrder) => {
        setSortOrder(newSortOrder);  // Update sort order state
        refetch();  // Trigger refetch when order option changes
    };

    return (
        <Container className="mx-auto">
            <div className="d-flex justify-content-between mb-3">
                {/* Sort Order Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-sort-order">
                        Order: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSortOrderChange('asc')}>{t('ascending')}</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortOrderChange('desc')}>{t('descending')}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Product List Display */}
            <div className="d-flex flex-wrap mx-auto justify-content-center">
                {isSuccess && allProducts.length > 0 && allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Load More Button for pagination */}
            {hasNextPage && (
                <div className="d-flex justify-content-center">
                    <Button variant="primary" disabled={isFetching} onClick={() => fetchNextPage()}>
                        {isFetching ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}
        </Container>
    );
}

export default Catalog;