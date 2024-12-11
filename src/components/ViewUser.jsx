import React from "react";
import { Container, Button, Alert, Modal } from "react-bootstrap";
import { State } from "../StateProvider"
import { useEffect, useState } from "react";
import { deleteUser, fetchUser } from "../hooks/queries";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

function UserProfile() {
    const {user, setUser} = State();
    const [userInfo, setUserInfo] = useState(null)
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const {t, i18n} = useTranslation();
    
    const getUserData = async () => {
        const foundUser = await fetchUser(user.userId); 

        if (foundUser) {
            setUserInfo(foundUser)
        } else {
            setErrorMessage("User not found");
        }
    }

    const handleDeleteUser = async () => {
        try {
            setShowSuccessModal(true)
            setSubmitting(true)
            deleteUser(user.userId);
            localStorage.removeItem('userSession');
            setUser({
                userId: '',
                username: '', 
                isLoggedIn: false});
            setShowSuccessModal(true)
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    const handleclose = () => {
        setShowSuccessModal(false);
        navigate(`/login`);
    }

    useEffect(() => {
        getUserData()
    }, [])

    if(!userInfo) return <p>loading...</p>
    if (isSubmitting) return <p>Submitting request...</p>

    return (
        <Container>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <h1>{t('userProfile')}</h1>
            <h2>{t('username')}: {userInfo.username}</h2>
            <h2>{t('email')}: {userInfo.email}</h2>
            <h2>{t('name')}: {userInfo.name.firstname} {userInfo.name.lastname}</h2>
            <h2>{t('address')}: {userInfo.address.number} {userInfo.address.street}, {userInfo.address.city}, {userInfo.address.zipcode}</h2>
            <Button 
                variant="warning"
                onClick={() => navigate('/edit-user')}
            >{t('edit')}</Button>
            <Button 
                variant="danger"
                onClick={() => handleDeleteUser()}
            >{t('delete')}</Button>
            <Modal show={showSuccessModal} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('success')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Account has been deleted!!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>{t('close')}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UserProfile;