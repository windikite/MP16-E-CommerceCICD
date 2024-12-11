import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {Container, Row, Col, Alert} from 'react-bootstrap'
import { State } from "../StateProvider"
import { fetchUsers, logIn } from "../hooks/queries";
import UserForm from "./UserForm";
import { useTranslation } from "react-i18next";

function Login() {
    const {user, setUser} = State();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem('userSession');
        if(storedUser) {
            const userSession = JSON.parse(storedUser);
            setUser(userSession);
            navigate('/')
        }
    }, [navigate, setUser]);

    const handleLogin = async (userInfo) => {
        try {
            // Log in the user (assuming logIn is synchronous)
            logIn(userInfo);
    
            // Fetch users and filter by the username
            const users = await fetchUsers(); // Fetch the users, waiting for the Promise to resolve
    
            // Find the user that matches the entered username
            const fetchedUser = users.find(x => x.username === userInfo.username);
    
            if (fetchedUser) {
                // Create a new user object with the fetched data
                let newUser = { ...user }; // Make sure to clone user if necessary
                newUser.username = fetchedUser.username;
                newUser.userId = fetchedUser.id;
                newUser.isLoggedIn = true;
    
                // Set the updated user in the state
                setUser(newUser);
    
                // Redirect to the homepage
                navigate('/');
            } else {
                setErrorMessage("User not found");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return ( 
        <Container className="vh-100">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={5}>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <UserForm
                        submitFunction={handleLogin}
                        prefillData={null}
                        buttonMessage={t('logIn')}
                    />
                </Col>
            </Row>
        </Container>
     );
}

export default Login;