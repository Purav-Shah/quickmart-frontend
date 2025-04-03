import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import '../../style/orders.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [productDetails, setProductDetails] = useState({});
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            const productIds = orders.flatMap(order => 
                order.orderItems.map(item => item.productId)
            );
            
            const uniqueProductIds = [...new Set(productIds)];
            
            const details = {};
            for (const productId of uniqueProductIds) {
                try {
                    const response = await ApiService.getProductById(productId);
                    details[productId] = response.product;
                } catch (error) {
                    console.error(`Error fetching product ${productId}:`, error);
                }
            }
            setProductDetails(details);
        };

        if (orders.length > 0) {
            fetchProductDetails();
        }
    }, [orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found. Please login again.');
            }
            const response = await ApiService.getOrdersByUserId(parseInt(userId));
            setOrders(response || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Unable to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    // Filter orders based on status
    const filteredOrders = statusFilter === 'ALL' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return <div className="orders-page">Loading orders...</div>;
    }

    if (error) {
        return <div className="orders-page error-message">{error}</div>;
    }

    return (
        <div className="orders-page">
            <h2>My Orders</h2>
            
            <div className="filter-section">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select 
                    id="statusFilter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                >
                    <option value="ALL">All Orders</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RETURNED">Returned</option>
                </select>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="no-orders">
                    <p>No orders found</p>
                </div>
            ) : (
                <>
                    <div className="orders-list">
                        {paginatedOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h3>Order #{order.id}</h3>
                                    <span className={`order-status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                
                                <div className="order-info">
                                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                                    <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                                </div>

                                <div className="order-items">
                                    <h4>Order Items</h4>
                                    {order.orderItems.map(item => {
                                        const product = productDetails[item.productId];
                                        return (
                                            <div key={item.id} className="order-item">
                                                <img 
                                                    src={product?.imageUrl || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg'} 
                                                    alt={item.productName} 
                                                />
                                                <div className="item-details">
                                                    <p><strong>{item.productName}</strong></p>
                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Price: ₹{item.price.toFixed(2)}</p>
                                                    <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default OrdersPage;