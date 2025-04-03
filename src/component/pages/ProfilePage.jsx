import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/profile.css';
import Pagination from "../common/Pagination";

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
        fetchOrders();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response);
        } catch (error) {
            console.error('Error fetching user info:', error);
            setError(error.message || 'Unable to fetch user info');
        }
    }

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }
            const response = await ApiService.getOrdersByUserId(parseInt(userId));
            
            // Fetch complete order details for each order
            const ordersWithDetails = await Promise.all(
                response.map(async (order) => {
                    try {
                        const detailedOrder = await ApiService.getOrderById(order.id);
                        return detailedOrder;
                    } catch (error) {
                        console.error(`Error fetching order details for order ${order.id}:`, error);
                        return order;
                    }
                })
            );
            
            setOrders(ordersWithDetails || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message || 'Unable to fetch orders');
        } finally {
            setLoading(false);
        }
    }

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        ApiService.logout();
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    if (loading) {
        return <div className="profile-page">Loading...</div>;
    }

    if (error) {
        return <div className="profile-page error-message">{error}</div>;
    }

    if (!userInfo) {
        return <div className="profile-page">No user information available</div>;
    }

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="profile-page">
            <div className="profile-content">
                <h2>Welcome {userInfo.name}</h2>

                <div className="user-info">
                    <p><strong>Name: </strong>{userInfo.name}</p>
                    <p><strong>Email: </strong>{userInfo.email}</p>
                </div>

                <div className="orders-section">
                    <h3>Order History</h3>
                    {orders.length > 0 ? (
                        <>
                            <ul className="orders-list">
                                {paginatedOrders.map(order => (
                                    <li key={order.id} className="order-item">
                                        <div className="order-header profile-order-header">
                                            <div>
                                                <h4>Order #{order.id}</h4>
                                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="order-details">
                                            <p><strong>Date: </strong>{new Date(order.orderDate).toLocaleDateString()}</p>
                                            <p><strong>Total Amount: </strong>₹{order.totalAmount.toFixed(2)}</p>
                                            <p><strong>Shipping Address: </strong>{order.shippingAddress}</p>
                                        </div>
                                        <div className="order-items">
                                            {order.orderItems.map(item => (
                                                <div key={item.id} className="order-product">
                                                    <div>
                                                        <p><strong>{item.productName}</strong></p>
                                                        <p>Quantity: {item.quantity}</p>
                                                        <p>Price: ₹{item.price.toFixed(2)}</p>
                                                        <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />
                            )}
                        </>
                    ) : (
                        <p>No orders found</p>
                    )}
                    
                    <button 
                        className="view-orders-btn"
                        onClick={() => navigate('/orders')}
                    >
                        View All Orders
                    </button>
                </div>
            </div>
            
            <div className="logout-section">
                <button onClick={handleLogoutClick} className="logout-button">
                    Logout
                </button>
            </div>

            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Confirm Logout</h4>
                        <p>Are you sure you want to log out?</p>
                        <div className="modal-buttons">
                            <button className="modal-button cancel" onClick={handleLogoutCancel}>
                                Cancel
                            </button>
                            <button className="modal-button confirm" onClick={handleLogoutConfirm}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;