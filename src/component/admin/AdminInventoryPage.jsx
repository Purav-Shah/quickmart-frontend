import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import '../../style/adminInventory.css';
import Pagination from "../common/Pagination";

const AdminInventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        try {
            const response = await ApiService.getAllProducts();
            const productList = response.productList || [];
            setProducts(productList);
            setTotalPages(Math.ceil(productList.length / itemsPerPage));
            
            // Fetch inventory for each product
            const inventoryPromises = productList
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(product => ApiService.getInventoryByProductId(product.id));
            
            const inventoryResults = await Promise.all(inventoryPromises);
            setInventory(inventoryResults);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch inventory');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleQuantityChange = async (productId, change) => {
        try {
            await ApiService.updateInventory(productId, change);
            setMessage('Inventory updated successfully');
            setTimeout(() => setMessage(''), 3000);
            fetchProducts(); // Refresh the data
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to update inventory');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="admin-inventory-page">
            <h2>Inventory Management</h2>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item, index) => (
                            <tr key={item.productId}>
                                <td>{item.productId}</td>
                                <td>{products.find(p => p.id === item.productId)?.name}</td>
                                <td>{item.quantity}</td>
                                <td className="inventory-actions">
                                    <button 
                                        onClick={() => handleQuantityChange(item.productId, -1)}
                                        disabled={item.quantity <= 0}
                                    >-</button>
                                    <button 
                                        onClick={() => handleQuantityChange(item.productId, 1)}
                                    >+</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default AdminInventoryPage; 