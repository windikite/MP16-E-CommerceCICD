import { array, func } from 'prop-types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Modal, Dropdown } from 'react-bootstrap';
import { fetchAllProducts, checkOut } from '../hooks/queries';
import { State } from "../StateProvider"
import { useTranslation } from "react-i18next";

const Cart = () => {
    const { user, cart, setCart } = State();
    const [products, setProducts] = useState([]);
    const [itemsInCart, setItemsInCart] = useState([]);
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMesage, setErrorMessage] = useState('');
    const {t, i18n} = useTranslation();

    function calculateTotal(){
        let total = 0;
        itemsInCart.forEach(x => {
            total+=(x.price * x.count)
        })
        return total
    }

    function filterProducts(){
        let filteredProducts = [];
        filteredProducts = products.filter(item => {
            return cart.find(x => {
                return parseInt(x) === item.id
            })
        })
        filteredProducts.forEach(x => {
            x.count = cart.filter(y => parseInt(y) === x.id).length
        })
        console.log(filteredProducts, itemsInCart)
        setItemsInCart(filteredProducts)
    }

    useEffect(() => {
        const allProducts = async () => {
            try {
                const data = await fetchAllProducts();  // Fetch the product data asynchronously
                setProducts(data);  // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching product:", error);
                setErrorMessage("Error fetching product data.");
            }
        };
        allProducts();
    }, []);

    useEffect(() => {
        if(products.length && cart.length){
            filterProducts()
        }
    }, [products, cart]);

    const handleCheckOut = async () => {
        try {
            const cartInfo = itemsInCart.map(x => {return {
                "userId": user.userId,
                "productId": x.id,
                "quantity": x.count
            }})  
            const response = await checkOut(cartInfo);
            clearCart();
            setShowSuccessModal(true);
        }catch (error){
            console.error('Error checking out cart:', error);
        }
    }

    function addToCart(id){
        const newCart = [...cart, id]
        setCart(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
    }
    
    const removeFromCart = (id) => {
        let newCart = [...cart];
        let foundInCart = newCart.indexOf(parseInt(id));
        if(foundInCart){
            newCart.splice(foundInCart, 1)
            setCart(newCart)
            localStorage.setItem("cart", JSON.stringify(newCart))
        };
    }

    function clearCart() {
        setCart([]);
        localStorage.setItem("cart", JSON.stringify([]));
    }

    const handleclose = () => {
        setShowSuccessModal(false);
        navigate('/catalog')
    }
    
    function createCard(key, p){
        return (
            <Card aria-label='item in cart' className="ms-auto me-auto mb-0 p-1 shadow border-info " style={{width: '95%'}} key={key}>
                <Row>
                    <Col xs lg='2'>
                        <Card.Img aria-label='item picture' src={p.image} style={{height: "5rem", width: "5rem"}} />
                    </Col>
                    <Col md="6">
                        <Card.Body className='d-flex flex-column align-items-center'>
                            <Card.Title aria-label='item name' className="mb-0 text-start">{p.title}</Card.Title>
                            <Card.Text aria-label='item price' className='text-secondary'>
                                ${p.price} each
                            </Card.Text>
                        </Card.Body>
                    </Col>
                    <Col xs lg='2'>
                        <Card.Body className='d-flex flex-row align-items-center'>
                            <Button 
                                aria-label='add to cart'
                                variant="primary" 
                                onClick={() => addToCart(p.id)}
                            >+</Button>
                            <Button 
                                aria-label='item quantity'
                                variant="dark text-light" 
                                disabled
                            >{p.count}</Button>
                            <Button 
                                aria-label='remove from cart'
                                variant="primary" 
                                onClick={() => removeFromCart(p.id)}
                            >-</Button>
                        </Card.Body>
                    </Col>
                    <Col xs lg='2'>
                        <Card.Body className='d-flex flex-column align-items-center'>
                            <Card.Title aria-label='price for quantity of item' className="mb-0 text-start text-success">${p.price*p.count}</Card.Title>
                            <Card.Text aria-label='price breakdown' className='text-secondary'>
                                ${p.price} each
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        )
    }

    return (
        <Container>
            <Row className='d-flex flex-row justify-content-around'>
                <Button className="mb-3 col col-6" variant="danger" onClick={() => clearCart()}>Clear Cart</Button>
            </Row>
            <Row>
                <Col>
                    <h3 className='mb-3'>Cart</h3>
                    
                    <div className="bg-dark-subtle w-100 h-100 mx-auto p-2 rounded">
                        {itemsInCart.map(product => createCard(product.id, product))}
                    </div>
                    <Button variant="success" onClick={() => handleCheckOut()} className="w-100 mb-3">{t('checkOut')} - ${calculateTotal()}</Button>
                </Col>
            </Row>

            <Modal show={showSuccessModal} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('success')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('orderSuccessful')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>{t('close')}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

Cart.protoTypes = {
    products: array
}

export default Cart