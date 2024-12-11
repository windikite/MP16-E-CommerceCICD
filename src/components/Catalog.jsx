import { fetchProducts, fetchProductsByCategory } from '../hooks/queries';
import { Button, Container, Spinner, Alert, Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from "react-i18next";

function Catalog() {
    const { category } = useParams();
    const [sortOrder, setSortOrder] = useState('asc');
    const {t, i18n} = useTranslation();

    const handleFetch = ({ pageParam = 1 }) => {
        return category
            ? fetchProductsByCategory(category, pageParam, 50,sortOrder)
            : fetchProducts({ pageParam, sortOrder });
    };

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
        queryKey: ['products', category, sortOrder], 
        queryFn: handleFetch,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= 5 ? nextPage : undefined;
        },
    });

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (data) {
            const products = data.pages.flat();
            setAllProducts(products);
        }
    }, [data]);

    if (isLoading) {
        return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    }

    if (isError) {
        return <Alert variant="danger">Error fetching data</Alert>;
    }

    const handleSortOrderChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
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

            <div className="d-flex flex-wrap mx-auto justify-content-center">
                {isSuccess && allProducts.length > 0 && allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

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
