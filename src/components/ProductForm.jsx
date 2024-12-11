// Import necessary components from React, React Router, PropTypes, Bootstrap, etc.
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  // For handling route params and navigation
import { object, func } from 'prop-types';  // For defining PropTypes
import { Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';  // For Bootstrap components
import { createProduct, fetchProduct, updateProduct } from "../hooks/queries";  // Custom hooks for API interactions
import { useTranslation } from "react-i18next";  // For translation support

const ProductForm = () => {
    // State variables for form data, errors, submission status, and modals
    const [product, setProduct] = useState({ title: '', price: '', image: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Get the 'id' param from the URL and the navigate function
    const { id } = useParams();
    const navigate = useNavigate();
    
    // For translation support
    const { t, i18n } = useTranslation();

    // Fetch product data if editing an existing product
    useEffect(() => {
        const fetchedData = async () => {
            try {
                const data = await fetchProduct(id);  // Fetch product data based on 'id'
                setProduct(data);  // Update the product state with the fetched data
            } catch (error) {
                console.error("Error fetching product:", error);
                setErrorMessage("Error fetching product data.");
            }
        };

        if (id) {
            fetchedData();  // If 'id' exists, fetch the data to edit the product
        }
    }, [id]);

    // Form validation function
    const validateForm = () => {
        const errors = {};
        if (!product.title) errors.title = 'Title is required';
        if (!product.price || product.price <= 0) errors.price = 'Price must be a positive number';
        if (!product.image) errors.image = 'Image is required';
        setErrors(errors);  // Set the validation errors in state
        return Object.keys(errors).length === 0;  // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;  // Stop if validation fails
        
        setSubmitting(true);  // Indicate form submission
        try {
            // Depending on whether 'id' exists, create or update the product
            if (id) {
                await updateProduct(product);
            } else {
                await createProduct(product);
            }
            setShowSuccessModal(true);  // Show success modal after successful submission
        } catch (error) {
            setErrorMessage(error.message);  // Capture any error during submission
        } finally {
            setSubmitting(false);  // Reset submission state after completion
        }
    };

    // Handle changes in form input
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    // Close the success modal and navigate to the product view page
    const handleclose = () => {
        setShowSuccessModal(false);
        navigate(`/view-product/${id}`);
    };

    // Show a loading message if the form is being submitted
    if (isSubmitting) return <p>Submitting product data...</p>;

    return (
        <>
            {/* Product form for adding or editing a product */}
            <Form onSubmit={handleSubmit}>
                <h3>{id ? 'Edit' : 'Add'} {t('product')}</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}  {/* Display error messages */}
                
                {/* Product title input */}
                <Form.Group controlId="productTitle">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                        isInvalid={!!errors.title}  // Show validation error if present
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title}  {/* Display validation message */}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Product price input */}
                <Form.Group controlId="productPrice">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={product.price}  // Ensure the correct price value is set
                        onChange={handleChange}
                        isInvalid={!!errors.price}  // Show validation error if present
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.price}  {/* Display validation message */}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Product image URL input */}
                <Form.Group controlId="productImage">
                    <Form.Label>Image:</Form.Label>
                    <Form.Control
                        type="text"
                        name="image"
                        value={product.image}
                        onChange={handleChange}
                        isInvalid={!!errors.image}  // Show validation error if present
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.image}  {/* Display validation message */}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Submit button with loading spinner when submitting */}
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit'}
                </Button>

                {/* Success modal that shows after successful form submission */}
                <Modal show={showSuccessModal} onHide={handleclose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('success')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Product has been successfully {id ? 'updated' : 'added'}!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleclose}>{t('close')}</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    );
};

// Define PropTypes to enforce expected types for props
ProductForm.propTypes = {
    selectedProduct: object,
    onProductUpdated: func
};

export default ProductForm;
