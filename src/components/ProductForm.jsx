import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { createProduct, fetchProduct, updateProduct } from "../hooks/queries";
import { useTranslation } from "react-i18next";

const ProductForm = () => {
    const [product, setProduct] = useState({title: '', price: '', image: ''});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        const fetchedData = async () => {
            try {
                const data = await fetchProduct(id);  // Fetch the product data asynchronously
                setProduct(data);  // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching product:", error);
                setErrorMessage("Error fetching product data.");
            }
        };
    
        if (id) {
            fetchedData();  // Call the asynchronous function to fetch data
        }
    }, [id]);

    const validateForm = () => {
        const errors = {};
        if(!product.title) errors.title = 'Title is required';
        if(!product.price || product.price <= 0) errors.price = 'Price must be a positive number';
        if(!product.image) errors.image = 'Image is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if(id) {
                await updateProduct(product);
            }else{
                await createProduct(product);
            }
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }))
    };

    const handleclose = () => {
        setShowSuccessModal(false);
        navigate(`/view-product/${id}`)
    }

    if (isSubmitting) return <p>Submitting product data...</p>
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <h3>{id ? 'Edit' : 'Add' } {t('product')}</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form.Group controlId="productTitle">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                        isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="productPrice">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={`{product.price}`}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.price}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="productImage">
                    <Form.Label>Image:</Form.Label>
                    <Form.Control
                        type="text"
                        name="image"
                        value={product.image}
                        onChange={handleChange}
                        isInvalid={!!errors.image}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.image}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit'}
                </Button>

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
    )
}

ProductForm.propTypes = {
    selectedProduct: object,
    onProductUpdated: func
}

export default ProductForm