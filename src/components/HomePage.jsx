import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { State } from "../StateProvider";
import { fetchCategories } from "../hooks/queries";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const { user, setUser } = State();  // Access user state from context
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Fetch categories from API
    const getCategories = async () => {
        try {
            setIsLoading(true);
            const foundCategories = await fetchCategories();  // Fetch categories data
            if (foundCategories) setCategories(foundCategories);  // Set categories to state
        } catch {
            console.log('unable to get categories');
            setIsError(true);  // Set error flag if fetching fails
        } finally {
            setIsLoading(false);  // Stop loading state
        }
    };

    useEffect(() => {
        getCategories();  // Fetch categories on component mount
    }, []);

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>;
    if (isError) return <Alert variant='danger'>Error fetching data</Alert>;

    return (
        <Container className="bg bg-light">
            {/* Display greeting if user is logged in */}
            {user.isLoggedIn && <p>Hello, {user.username}!</p>}
            <Row>
                {categories.length >= 1 &&
                    categories.map((category, i) => {
                        return <Col key={i}>
                            <Link to={`/catalog/${category}`}>{category}</Link>  {/* Link to category page */}
                        </Col>
                    })
                }
            </Row>
        </Container>
    );
}

export default HomePage;