import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { State } from "../StateProvider"

function Logout() {
    const {setUser} = State();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('userSession');
        setUser({
            userId: '',
            username: '', 
            isLoggedIn: false});
        navigate('/');
    }, [navigate, setUser])

    return (
        <div>Logging out...</div>
    )
}

export default Logout;