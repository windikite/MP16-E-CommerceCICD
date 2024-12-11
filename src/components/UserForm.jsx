import { useState, useEffect } from "react";
import { Form, Button } from 'react-bootstrap'
import React from "react";

function UserForm({submitFunction, prefillData, buttonMessage}) {
    const [userInfo, setUserInfo] = useState({
        'username': '',
        'password': ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(prefillData) setUserInfo(prefillData);
    }, [])

    const validateForm = () => {
        const errors = {};
        if(!userInfo.username) errors.username = 'Username is required';
        if(!userInfo.password) errors.password = 'Password is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo(prevProduct => ({
            ...prevProduct,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        submitFunction(userInfo);
    };

    return ( 
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="usernameInput">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={userInfo.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.username}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="userPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">{buttonMessage}</Button>
        </Form>
     );
}

export default UserForm;