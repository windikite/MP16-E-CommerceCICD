import { createContext, useContext, useState, useEffect } from "react";

import React from "react";

const StateContext = createContext();

export const State = () => useContext(StateContext)

export const StateProvider = ({children}) => {
    const [user, setUser] = useState({
        userId: '',
        username: '', 
        isLoggedIn: false})
    const [ cart, setCart ] = useState([])

    function getCart(){
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if(savedCart !== null){
            setCart(savedCart)
        }
    }

    useEffect(() => {
        getCart();
    }, []);

    return (
        <StateContext.Provider value={{
            user,
            setUser,
            cart, 
            setCart
            }}>
            {children}
        </StateContext.Provider>
    )
}
