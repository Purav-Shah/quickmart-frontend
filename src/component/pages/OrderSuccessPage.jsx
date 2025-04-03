import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/orderSuccess.css';

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderNumber = location.state?.orderNumber;

    const handleViewOrders = () => {
        navigate('/orders');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div className="order-success-container">
            <div className="order-success-content">
                <div className="success-icon">✓</div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your purchase.</p>
                <div className="order-details">
                    <p>Order Number: <span className="order-number">{orderNumber}</span></p>
                </div>
                <div className="buttons-container">
                    <div className="action-buttons">
                        <button className="view-orders-btn" onClick={handleViewOrders}>
                            View Orders
                        </button>
                        <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage; 