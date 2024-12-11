import UserForm from "./UserForm";
import { State } from "../StateProvider";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { updateUser } from "../hooks/queries";
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function EditUser() {
    const { user, setUser } = State();  // Get user state from context
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  // Hook for navigation
    const { t, i18n } = useTranslation();  // Translation hook

    // Handle user update
    const handleUpdate = async (userInfo) => {
        try {
            // Update user data
            await updateUser(userInfo);
            navigate('/view-user');  // Redirect to view user page after successful update
        } catch (error) {
            setErrorMessage(error.message);  // Set error message if update fails
        }
    };

    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    <h1>{t('edit')} {t('user')}</h1>  {/* Display translated heading */}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <UserForm
                        submitFunction={handleUpdate}  // Pass handleUpdate to the UserForm
                        prefillData={user}  // Prefill data with current user information
                        buttonMessage={t('update')}  // Button text for updating
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default EditUser;