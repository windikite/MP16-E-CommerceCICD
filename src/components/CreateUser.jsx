import UserForm from "./UserForm";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createUser } from "../hooks/queries";
import { Container, Row, Col, Alert, Modal, Button } from 'react-bootstrap';

function CreateUser() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    // Handle user creation on form submission
    const handleCreate = async (userInfo) => {
        try {
            setSubmitting(true);
            await createUser(userInfo);  // Call createUser API
            setShowSuccessModal(true);  // Show success modal on success
        } catch (error) {
            setErrorMessage(error.message);  // Set error message if creation fails
        } finally {
            setSubmitting(false);  // Stop submitting state
        }
    };

    const handleclose = () => {
        setShowSuccessModal(false);  // Close success modal
        navigate('/');  // Redirect to homepage
    };

    if (isSubmitting) return <p>Submitting request...</p>;  // Show loading message while submitting

    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    <h1>Sign Up</h1>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <UserForm
                        submitFunction={handleCreate}  // Pass handleCreate to the UserForm
                        prefillData={null}  // No prefilled data for new users
                        buttonMessage='Sign Up'  // Button text for the form
                    />
                </Col>
            </Row>
            {/* Success Modal after user creation */}
            <Modal show={showSuccessModal} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Account has been created!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default CreateUser;