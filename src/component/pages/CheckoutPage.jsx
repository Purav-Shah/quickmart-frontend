import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import '../../style/checkout.css';

const CheckoutPage = () => {
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ApiService.isAuthenticated()) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
            setError('Please fill in all fields');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const userId = parseInt(localStorage.getItem('userId'));
            if (!userId) {
                throw new Error('User ID not found. Please login again.');
            }

            const orderItems = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const orderRequest = {
                userId: userId,
                shippingAddress: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
                orderItems: orderItems
            };

            const response = await ApiService.createOrder(orderRequest);
            
            // Clear the cart
            dispatch({ type: 'CLEAR_CART' });
            
            // Navigate to success page with order number
            navigate('/order-success', { 
                state: { orderNumber: response.id },
                replace: true // This prevents going back to the checkout page
            });
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <h1>Checkout</h1>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Street Address</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>ZIP Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        {cart.map(item => (
                            <div key={item.id} className="order-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="order-total">
                            <strong>Total:</strong>
                            <strong>₹{totalPrice.toFixed(2)}</strong>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="place-order-btn"
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage; 