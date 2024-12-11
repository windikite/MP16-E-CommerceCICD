// Import necessary components
import { Card } from "react-bootstrap";  // Bootstrap Card component for displaying product info
import React from "react";  // React library for creating the component
import { memo } from 'react';  // React's memoization function to optimize re-renders
import { Link } from "react-router-dom";  // Link component for navigating between pages

// Memoize the ProductCard to prevent unnecessary re-renders if the props don't change
const ProductCard = memo(function ProductCard({ product }) {
    return (
        // Bootstrap Card component with custom styling for product display
        <Card className="ms-2 me-2 mb-2 p-1 shadow border-info" style={{ width: '15rem', height: "20rem" }}>
            
            {/* Display the product image with custom height, width, and object-fit for responsiveness */}
            <Card.Img variant="top" src={product.image} style={{ height: '10rem', maxWidth: '15rem', objectFit: 'contain' }} />
            
            <Card.Body>
                {/* Display the price of the product at the top with a small margin */}
                <Card.Title className="mb-0 text-start">${product.price}</Card.Title>
                
                {/* Product title displayed as a clickable link to the product detail page */}
                <Card.Text>
                    <Link to={`/view-product/${product.id}`} className="text-decoration-none">
                        {product.title}
                    </Link>
                </Card.Text>
            </Card.Body>
        </Card>
    );
});

// Export the memoized ProductCard component
export default ProductCard;
