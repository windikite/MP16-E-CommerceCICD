import { Card } from "react-bootstrap"
import React from "react";
import { memo } from 'react';
import { Link } from "react-router-dom";

const ProductCard = memo(function ProductCard({product}){
    return (
        <Card className="ms-2 me-2 mb-2 p-1 shadow border-info" style={{width: '15rem', height: "20rem"}}>
            <Card.Img variant="top" src={product.image} style={{height: '10rem', maxWidth: '15rem', objectFit: 'contain'}}  />
            <Card.Body>
                <Card.Title className="mb-0 text-start">${product.price}</Card.Title>
                <Card.Text>
                    <Link to={`/view-product/${product.id}`} className="text-decoration-none">
                        {product.title}
                    </Link>
                </Card.Text>
                
            </Card.Body>
        </Card>
    )
});

export default ProductCard;