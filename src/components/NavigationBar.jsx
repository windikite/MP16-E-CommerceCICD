// Import necessary components and hooks
import { NavLink } from "react-router-dom";  // For navigation links
import { Navbar, Nav } from "react-bootstrap";  // Bootstrap components for layout
import { State } from "../StateProvider";  // Custom hook for accessing global state (user and cart)
import { Button, Badge } from "react-bootstrap";  // For button styling and displaying the cart count
import { useNavigate } from "react-router-dom";  // Hook for programmatic navigation
import { useTranslation } from "react-i18next";  // For i18n translation handling

function NavigationBar() {
    // Accessing the user and cart state from the global state provider (StateProvider)
    const { user, cart } = State();
    const navigate = useNavigate();  // Hook to navigate programmatically
    const { t, i18n } = useTranslation();  // UseTranslation hook to handle language changes

    // Function to change language using the i18n instance
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }

    return (
        <Navbar bg="light" expand="lg" className="p-2 mb-3">
            {/* Navigation bar brand with a link to the home page */}
            <Navbar.Brand href="/" className="text-info align-items-center">{t('home')}</Navbar.Brand>

            {/* Navbar toggle for mobile responsiveness */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
            {/* Navbar collapse containing the navigation links */}
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {/* Browse catalog link */}
                    <Nav.Link as={NavLink} to="/catalog" activeclassname="active">
                        {t('browse')}
                    </Nav.Link>

                    {/* Conditional rendering for log in/out links */}
                    {user.isLoggedIn ? 
                        // If the user is logged in, show the log out link
                        <Nav.Link as={NavLink} to="/logout" activeclassname="active">
                            {t('logOut')}
                        </Nav.Link> :
                        // If the user is not logged in, show the log in link
                        <Nav.Link as={NavLink} to="/login" activeclassname="active">
                            {t('logIn')}
                        </Nav.Link>
                    }

                    {/* Account link if the user is logged in */}
                    {user.isLoggedIn && 
                        <Nav.Link as={NavLink} to="/view-user" activeclassname="active">
                            {t('account')}
                        </Nav.Link>
                    }

                    {/* Sign up link if the user is not logged in */}
                    {!user.isLoggedIn &&
                        <Nav.Link as={NavLink} to="/sign-up" activeclassname="active">
                            {t('signUp')}
                        </Nav.Link>
                    }

                    {/* Admin-specific link to add a product if the user is 'johnd' */}
                    {user.name === 'johnd' && 
                        <Nav.Link as={NavLink} to="/add-product" activeclassname="active">
                            {t('add')} {t('product')}
                        </Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>

            {/* Language selector buttons */}
            <div>
                <Button onClick={() => changeLanguage('en')} variant="secondary" className="me-2">English</Button>
                <Button onClick={() => changeLanguage('jp')} variant="secondary" className="me-2">日本語</Button>
            </div>

            {/* Cart button displayed if the user is logged in */}
            {user.isLoggedIn && 
                <Button 
                    variant='light'
                    onClick={() => navigate('/cart')}  // Navigate to the cart page
                >
                    {/* Cart icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    {/* Display cart count */}
                    <Badge bg="secondary">{cart.length}</Badge>
                </Button>
            }
        </Navbar>
    );
}

export default NavigationBar;
