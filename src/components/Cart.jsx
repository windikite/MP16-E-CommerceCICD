// Import necessary libraries and components
import { array, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Modal, Alert } from 'react-bootstrap';
import { fetchAllProducts, checkOut } from '../hooks/queries';
import { State } from "../StateProvider";
import { useTranslation } from "react-i18next";

// Cart component definition
const Cart = () => {
    // Extract global state and functions from StateProvider
    const { user, cart, setCart } = State();

    // Local state to manage products, cart items, and UI states
    const [products, setProducts] = useState([]); // All available products
    const [itemsInCart, setItemsInCart] = useState([]); // Products in the user's cart
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false); // Tracks checkout submission
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
    const [errorMessage, setErrorMessage] = useState(''); // Error message for failed requests
    const { t, i18n } = useTranslation(); // Translation hook

    // Calculate the total cost of items in the cart
    function calculateTotal() {
        let total = 0;
        itemsInCart.forEach(x => {
            total += (x.price * x.count);
        });
        return total;
    }

    // Filter products to find those in the cart and update their quantities
    function filterProducts() {
        let filteredProducts = products.filter(item => {
            return cart.find(x => parseInt(x) === item.id);
        });

        filteredProducts.forEach(x => {
            x.count = cart.filter(y => parseInt(y) === x.id).length;
        });

        setItemsInCart(filteredProducts);
    }

    // Fetch all products when the component loads
    useEffect(() => {
        const allProducts = async () => {
            try {
                const data = await fetchAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                setErrorMessage("Error fetching product data.");
            }
        };
        allProducts();
    }, []);

    // Update items in the cart whenever products or the cart changes
    useEffect(() => {
        if (products.length && cart.length) {
            filterProducts();
        }
    }, [products, cart]);

    // Handle the checkout process
    const handleCheckOut = async () => {
        try {
            setSubmitting(true)
            // Map items in the cart to the format required by the backend
            const cartInfo = itemsInCart.map(x => ({
                "userId": user.userId,
                "productId": x.id,
                "quantity": x.count
            }));

            const response = await checkOut(cartInfo);
            clearCart(); // Clear the cart on successful checkout
            setShowSuccessModal(true); // Show success modal
        } catch (error) {
            console.error('Error checking out cart:', error);
        }finally{
            setSubmitting(false)
        }
    };

    // Add an item to the cart
    function addToCart(id) {
        const newCart = [...cart, id];
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    }

    // Remove an item from the cart
    const removeFromCart = (id) => {
        let newCart = [...cart];
        let foundInCart = newCart.indexOf(parseInt(id));

        if (foundInCart !== -1) {
            newCart.splice(foundInCart, 1);
            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
        }
    };

    // Clear the entire cart
    function clearCart() {
        setCart([]);
        localStorage.setItem("cart", JSON.stringify([]));
    }

    // Close the success modal and navigate back to the catalog
    const handleclose = () => {
        setShowSuccessModal(false);
        navigate('/catalog');
    };

    // Create a card component for each item in the cart
    function createCard(key, p) {
        return (
            <Card
                aria-label='item in cart'
                className="ms-auto me-auto mb-0 p-1 shadow border-info"
                style={{ width: '95%' }}
                key={key}
            >
                <Row>
                    {/* Product image */}
                    <Col xs lg='2'>
                        <Card.Img
                            aria-label='item picture'
                            src={p.image}
                            style={{ height: "5rem", width: "5rem" }}
                        />
                    </Col>

                    {/* Product details */}
                    <Col md="6">
                        <Card.Body className='d-flex flex-column align-items-center'>
                            <Card.Title aria-label='item name' className="mb-0 text-start">{p.title}</Card.Title>
                            <Card.Text aria-label='item price' className='text-secondary'>
                                ${p.price} each
                            </Card.Text>
                        </Card.Body>
                    </Col>

                    {/* Quantity controls */}
                    <Col xs lg='2'>
                        <Card.Body className='d-flex flex-row align-items-center'>
                            <Button
                                aria-label='add to cart'
                                variant="primary"
                                onClick={() => addToCart(p.id)}
                            >+</Button>
                            <Button
                                aria-label='item quantity'
                                variant="dark text-light"
                                disabled
                            >{p.count}</Button>
                            <Button
                                aria-label='remove from cart'
                                variant="primary"
                                onClick={() => removeFromCart(p.id)}
                            >-</Button>
                        </Card.Body>
                    </Col>

                    {/* Total price for the item */}
                    <Col xs lg='2'>
                        <Card.Body className='d-flex flex-column align-items-center'>
                            <Card.Title aria-label='price for quantity of item' className="mb-0 text-start text-success">
                                ${p.price * p.count}
                            </Card.Title>
                            <Card.Text aria-label='price breakdown' className='text-secondary'>
                                ${p.price} each
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        );
    }
    if (isSubmitting) return <p>Submitting product data...</p>
    // Main render
    return (
        <Container>
            {/* Display error message if present */}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {/* Clear cart button */}
            <Row className='d-flex flex-row justify-content-around'>
                <Button className="mb-3 col col-6" variant="danger" onClick={() => clearCart()}>Clear Cart</Button>
            </Row>

            {/* Cart items and checkout button */}
            <Row>
                <Col>
                    <h3 className='mb-3'>Cart</h3>
                    <div className="bg-dark-subtle w-100 h-100 mx-auto p-2 rounded">
                        {itemsInCart.map(product => createCard(product.id, product))}
                    </div>
                    <Button
                        variant="success"
                        onClick={() => handleCheckOut()}
                        className="w-100 mb-3"
                    >
                        {t('checkOut')} - ${calculateTotal()}
                    </Button>
                </Col>
            </Row>

            {/* Success modal */}
            <Modal show={showSuccessModal} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('success')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('orderSuccessful')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>{t('close')}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

// Prop types validation
Cart.protoTypes = {
    products: array
};

export default Cart;
