// Import necessary hooks and components
import { useState, useEffect } from "react";  // React hooks for state management and side effects
import { useNavigate } from 'react-router-dom';  // Hook to navigate programmatically
import { Container, Row, Col, Alert } from 'react-bootstrap';  // UI components from react-bootstrap
import { State } from "../StateProvider";  // Custom state provider for user context
import { fetchUsers, logIn } from "../hooks/queries";  // API functions for fetching users and logging in
import UserForm from "./UserForm";  // Custom form component for user login
import { useTranslation } from "react-i18next";  // Hook for internationalization (i18n)

function Login() {
    // Get user state and setter function from StateProvider context
    const { user, setUser } = State();
    const [errorMessage, setErrorMessage] = useState('');  // State for holding error messages
    const navigate = useNavigate();  // Hook to navigate between pages
    const { t, i18n } = useTranslation();  // Translation hook to support multilingual content

    // Effect to check if there's an existing session in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('userSession');  // Retrieve stored session
        if (storedUser) {
            const userSession = JSON.parse(storedUser);  // Parse stored user session data
            setUser(userSession);  // Set the user state with stored session
            navigate('/');  // Redirect to homepage if user is already logged in
        }
    }, [navigate, setUser]);  // Dependency on navigate and setUser

    // Handle user login when the form is submitted
    const handleLogin = async (userInfo) => {
        try {
            // Attempt to log in the user (assuming logIn is a synchronous operation)
            logIn(userInfo);

            // Fetch all users from the database
            const users = await fetchUsers();  // Fetch users and wait for the Promise to resolve

            // Find the user that matches the entered username
            const fetchedUser = users.find(x => x.username === userInfo.username);

            if (fetchedUser) {
                // If user is found, create a new user object and update state
                let newUser = { ...user };  // Clone the existing user object if necessary
                newUser.username = fetchedUser.username;
                newUser.userId = fetchedUser.id;
                newUser.isLoggedIn = true;  // Mark the user as logged in

                // Update user state with the new user object
                setUser(newUser);

                // Redirect to homepage after successful login
                navigate('/');
            } else {
                // Set an error message if the user is not found
                setErrorMessage("User not found");
            }
        } catch (error) {
            // Catch any errors and display the error message
            setErrorMessage(error.message);
        }
    };

    return (
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    {/* Display error message if there's an error */}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {/* User login form */}
                    <UserForm
                        submitFunction={handleLogin}  // Pass handleLogin function as the form's submit handler
                        prefillData={null}  // No prefilled data (since it's a login form)
                        buttonMessage={t('logIn')}  // Display login button text from the translation file
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
