import React, { useState, useEffect } from "react";
import { Container, Button, Alert, Modal } from "react-bootstrap"; // Importing necessary components from react-bootstrap
import { State } from "../StateProvider"; // Importing State context to access user data and set user state
import { fetchUser, deleteUser } from "../hooks/queries"; // Importing hooks for fetching and deleting user data
import { useNavigate } from 'react-router-dom'; // For navigation between routes
import { useTranslation } from "react-i18next"; // For translations

function UserProfile() {
    // Using the State context to get and set the current user state
    const { user, setUser } = State();

    // Local state for holding user data, error messages, modal visibility, and submission state
    const [userInfo, setUserInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    // Using useNavigate hook for programmatic navigation
    const navigate = useNavigate();

    // Translation hook to handle different languages in the app
    const { t } = useTranslation();
    
    // Function to fetch user data from the server using the user ID
    const getUserData = async () => {
        try {
            const foundUser = await fetchUser(user.userId); // Fetch user data using userId
            if (foundUser) {
                setUserInfo(foundUser); // Set the fetched user data to state
            } else {
                setErrorMessage("User not found"); // Handle case when user is not found
            }
        } catch (error) {
            setErrorMessage("Error fetching user data"); // Handle errors during the fetch operation
        }
    };

    // Function to handle the deletion of the user account
    const handleDeleteUser = async () => {
        try {
            setSubmitting(true); // Set submission state to true (loading state)
            await deleteUser(user.userId); // Delete the user by userId
            localStorage.removeItem('userSession'); // Remove user session data from localStorage
            setUser({ userId: '', username: '', isLoggedIn: false }); // Update global user state to log out the user
            setShowSuccessModal(true); // Show success modal after deletion
        } catch (error) {
            setErrorMessage(error.message); // Set error message in case of failure during user deletion
        } finally {
            setSubmitting(false); // Reset submission state (loading state)
        }
    };

    // Function to close the success modal and navigate to the login page
    const handleclose = () => {
        setShowSuccessModal(false); // Close the success modal
        navigate(`/login`); // Redirect to the login page after successful deletion
    };

    // useEffect hook to fetch user data when the component mounts or userId changes
    useEffect(() => {
        getUserData(); // Fetch user data based on userId from global state
    }, [user.userId]); // Dependency array ensures this effect runs when the userId changes

    // If userInfo is not loaded yet, show a loading message
    if (!userInfo) return <p>{t('loading')}...</p>;

    // If the delete user process is in progress, show a submitting message
    if (isSubmitting) return <p>{t('submittingRequest')}...</p>;

    return (
        <Container>
            {/* Display an error message if there is any */}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {/* Display user profile information */}
            <h1>{t('userProfile')}</h1>
            <h2>{t('username')}: {userInfo.username}</h2>
            <h2>{t('email')}: {userInfo.email}</h2>
            <h2>{t('name')}: {userInfo.name.firstname} {userInfo.name.lastname}</h2>
            <h2>{t('address')}: {userInfo.address.number} {userInfo.address.street}, {userInfo.address.city}, {userInfo.address.zipcode}</h2>

            {/* Button to navigate to edit user page */}
            <Button variant="warning" onClick={() => navigate('/edit-user')}>{t('edit')}</Button>

            {/* Button to trigger the delete user function */}
            <Button variant="danger" onClick={handleDeleteUser}>{t('delete')}</Button>

            {/* Success modal that shows after the account has been deleted */}
            <Modal show={showSuccessModal} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('success')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('accountDeleted')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>{t('close')}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UserProfile;
