import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminOrderPage.css'
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import { toast } from 'react-toastify';


const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];


const AdminOrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchStatus, setSearchStatus] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [searchStatus, currentPage]);



    const fetchOrders = async () => {
        try {
            let response;
            if(searchStatus){
                response = await ApiService.getAllOrderItemsByStatus(searchStatus);
                const orderList = response.orderItemList || [];
                setTotalPages(Math.ceil(orderList.length/itemsPerPage));
                setOrders(orderList);
                setFilteredOrders(orderList.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
            } else {
                response = await ApiService.getAllOrders();
                const orderList = response || [];
                setTotalPages(Math.ceil(orderList.length/itemsPerPage));
                setOrders(orderList);
                setFilteredOrders(orderList.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
            }
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch orders')
            setTimeout(()=>{
                setError('')
            }, 3000)
            setLoading(false);
        }
    }

    const handleFilterChange = (e) =>{
        const filterValue = e.target.value;
        setStatusFilter(filterValue)
        setCurrentPage(1);

        if (filterValue) {
            const filtered = orders.filter(order => order.status === filterValue);
            setFilteredOrders(filtered.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        }else{
            setFilteredOrders(orders.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(orders.length / itemsPerPage));
        }
    }


    const handleSearchStatusChange = async (e) => {
        setSearchStatus(e.target.value);
        setCurrentPage(1);
    }

    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`)
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await ApiService.updateOrderStatus(orderId, newStatus);
            toast.success('Order status updated successfully');
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <div className="loading">Loading orders...</div>;
    }

    return (
        <div className="admin-orders-page">
            <h2>Orders</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="filter-container">
                <div className="statusFilter">
                    <label >Filter By Status</label>
                    <select value={statusFilter} onChange={handleFilterChange}>
                        <option value="ALL">All</option>
                        {OrderStatus.map(status=>(
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="searchStatus">
                <label>Search By Status</label>
                    <select value={searchStatus} onChange={handleSearchStatusChange}>
                        <option value="">All</option>
                        {OrderStatus.map(status=>(
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                </div>
            </div>

            <div className="orders-list">
                {filteredOrders.length === 0 ? (
                    <div className="no-orders">No orders found</div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                                <div className="order-summary">
                                    <span>Order #{order.id}</span>
                                    <span>Date: {formatDate(order.orderDate)}</span>
                                    <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                                    <span className={`status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <button className="expand-btn">
                                    {expandedOrder === order.id ? '▼' : '▶'}
                                </button>
                            </div>

                            {expandedOrder === order.id && (
                                <div className="order-details">
                                    <div className="customer-info">
                                        <h4>Order Information</h4>
                                        <p>User ID: {order.userId}</p>
                                        <p>Shipping Address: {order.shippingAddress}</p>
                                        <p>Payment ID: {order.paymentId}</p>
                                    </div>

                                    <div className="order-items">
                                        <h4>Order Items</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.orderItems.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.productName}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>₹{item.price.toFixed(2)}</td>
                                                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="order-actions">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="status-select"
                                        >
                                            {OrderStatus.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page)=> setCurrentPage(page)}/>
        </div>
    )
}

export default AdminOrdersPage;