import UserForm from "./UserForm";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createUser } from "../hooks/queries";
import {Container, Row, Col, Alert, Modal, Button} from 'react-bootstrap'

function CreateUser() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    const handleCreate = async (userInfo) => {
        try {
            setSubmitting(true)
            await createUser(userInfo);
            setShowSuccessModal(true)
        } catch (error) {
            setErrorMessage(error.message);
        }finally{
            setSubmitting(false)
        }
    };

    const handleclose = () => {
        setShowSuccessModal(false);
        navigate(`/`);
    }

    if (isSubmitting) return <p>Submitting request...</p>

    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    <h1>Sign Up</h1>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <UserForm
                        submitFunction={handleCreate}
                        prefillData={null}
                        buttonMessage='Sign Up'
                    />
                </Col>
            </Row>
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