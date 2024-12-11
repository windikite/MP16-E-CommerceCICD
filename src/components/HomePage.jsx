import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { State } from "../StateProvider"
import { fetchCategories } from "../hooks/queries";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const {user, setUser} = State();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const getCategories = async () => {
        try {
            setIsLoading(true);
            const foundCategories = await fetchCategories();
            if(foundCategories) setCategories(foundCategories);
        }catch{
            console.log('unable to get categories')
            setIsError(true)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    if (isLoading) return <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>
    if (isError) return <Alert variant='danger'>Error fetching data</Alert>

    return (
        <Container className="bg bg-light">
            {user.isLoggedIn && `Hello, ${user.username}!`}
            <Row>
                {categories.length >= 1 && 
                    categories.map((category, i) => {
                        return <Col key={i}>
                            <Link 
                                to={`/catalog/${category}`} 
                                >{category}</Link>
                        </Col>
                    })
                }
            </Row>
        </Container>
    );
}

export default HomePage;