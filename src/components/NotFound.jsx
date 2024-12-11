// Import necessary components and hooks
import { Link } from "react-router-dom";  // Link component for navigation to the homepage
import { Image, Container, Row, Col } from "react-bootstrap";  // Bootstrap components for layout and styling

function NotFound() {
    return (
        // Outer div with styling for a centered error message, bordered, and responsive
        <div className="w-100 h-100 mx-auto p-5 border border-info">
            {/* Bootstrap Container for centralizing content */}
            <Container>
                {/* Display the 404 image, making it responsive and rounded */}
                <Image className="mb-3" src="/404.jpg" fluid rounded />
                
                {/* Row for the "404 - Not Found" message */}
                <Row>
                    <Col>
                        <h2 className="text-info">404 - Not Found</h2>
                    </Col>
                </Row>

                {/* Row for the apology message */}
                <Row>
                    <Col>
                        <p className="text-info">Sorry, the page you are looking for does not exist</p>
                    </Col>
                </Row>

                {/* Row with a link to redirect users back to the homepage */}
                <Row>
                    <Col>
                        <p className="text-warning">You can always go back to the <Link to='/'>homepage</Link></p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default NotFound;
