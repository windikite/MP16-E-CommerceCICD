import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Modal, Image, Row, Col } from 'react-bootstrap';
import { State } from "../StateProvider";
import { fetchProduct, deleteProduct } from "../hooks/queries";
import { useTranslation } from "react-i18next";

function ProductPage() {
    const { user, cart, setCart } = State();  // Get user and cart data from context
    const [product, setProduct] = useState({title: '', price: '', image: ''});
    const { id } = useParams();  // Get the product id from the URL
    const navigate = useNavigate();  // For navigation
    const [isSubmitting, setSubmitting] = useState(false);  // Loading state for delete action
    const [showSuccessModal, setShowSuccessModal] = useState(false);  // Show delete success modal
    const [errorMesage, setErrorMessage] = useState('');  // Error message for any failed operation
    const {t} = useTranslation();  // For translation

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const data = await fetchProduct(id);  // Fetch product details from API
                setProduct(data);  // Set product details to state
            } catch (error) {
                setErrorMessage("Error fetching product data.");
            }
        };

        if (id) {
            fetchProductData();  // Fetch data when component mounts or id changes
        }
    }, [id]);

    // Delete product logic
    const handleDelete = async (id) => {
        try {
            setSubmitting(true);  // Set submitting state
            await deleteProduct(id);  // Call delete product API
            setShowSuccessModal(true);  // Show success modal
        } catch (error) {
            setErrorMessage(error.message);  // Display any error message
        } finally {
            setSubmitting(false);  // Reset submitting state
        }
    };

    // Close success modal and navigate to catalog
    const handleclose = () => {
        setShowSuccessModal(false);
        navigate('/catalog');  // Navigate back to catalog page
    };

    // Add product to cart (localStorage based)
    function addToCart(id) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];  // Retrieve current cart from localStorage
        const newCart = [...cart, id];  // Add the product id to cart
        setCart(newCart);  // Update state
        localStorage.setItem("cart", JSON.stringify(newCart));  // Store updated cart in localStorage
    }

    return (
        <Row className="w-75 mx-auto">
            <Col>
                <Image src={product.image} alt="product picture" rounded style={{maxHeight: '20rem'}} />
            </Col>
            <Col className="d-flex flex-column text-align-center align-items-center">
                <h2>{product.title}</h2>
                <h3>from ${product.price}</h3>
                <h4>{product.description}</h4>
                
                {/* Show Admin buttons for editing and deleting */}
                {user.name === 'admin' && (
                    <div className='d-flex'>
                        <Button 
                            variant="warning" 
                            disabled={isSubmitting}
                            onClick={() => navigate(`/edit-product/${id}`)} 
                            className="me-2">{t('edit')}
                        </Button>
                        <Button 
                            variant="danger" 
                            disabled={isSubmitting}
                            onClick={() => handleDelete(id)} 
                            className="me-2">{t('delete')}
                        </Button>
                    </div>
                )}

                {/* Show Add to Cart button for logged-in users */}
                {user.name !== 'admin' && user.name !== '' && (
                    <div className='d-flex'>
                        <Button variant="primary" onClick={() => addToCart(id)} className="me-2">{t('addToCart')}</Button>
                    </div>
                )}

                {/* Prompt for logged-out users to log in */}
                {user.name === '' && (
                    <div className='d-flex'>
                        <Button variant="primary" onClick={() => navigate(`/login`)} className="me-2">{t('addToCart')}</Button>
                    </div>
                )}
            </Col>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('success')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Product has been successfully deleted!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>{t('close')}</Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}

export default ProductPage;
