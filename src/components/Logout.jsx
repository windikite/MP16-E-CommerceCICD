// Import necessary hooks and components
import { useEffect } from "react";  // React hook for running side effects
import { useNavigate } from "react-router-dom";  // Hook to navigate programmatically
import { State } from "../StateProvider";  // Custom state provider for user context

function Logout() {
    // Extract the setUser function from the StateProvider context to update the user state
    const { setUser } = State();
    const navigate = useNavigate();  // Hook for navigation after logout

    // useEffect hook is used to run side-effects (logout functionality) when the component mounts
    useEffect(() => {
        // Remove user session data from localStorage
        localStorage.removeItem('userSession');
        
        // Update the user state to log them out (reset user information)
        setUser({
            userId: '',  // Clear user ID
            username: '',  // Clear username
            isLoggedIn: false  // Mark the user as not logged in
        });
        
        // Redirect the user to the homepage (or any other page)
        navigate('/');
    }, [navigate, setUser]);  // Dependency array ensures this effect runs once on component mount

    return (
        <div>Logging out...</div>  // Show a simple message during the logout process
    );
}

export default Logout;
