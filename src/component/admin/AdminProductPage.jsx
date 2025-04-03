import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminProduct.css'
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const fetchProducts = async() => {
        try {
            const response = await ApiService.getAllProducts();
            const productList = response.productList || [];
            setTotalPages(Math.ceil(productList.length/itemsPerPage));
            setProducts(productList.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch products');
        }
    }

    useEffect(()=>{
        fetchProducts();
    }, [currentPage]);

    const handleEdit = async (id) => {
        navigate(`/admin/edit-product/${id}`);
    }

    const handleDelete = async(id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if(confirmed){
            try {
                await ApiService.deleteProduct(id);
                await fetchProducts();
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Unable to delete product');
            }
        }
    }

    return(
        <div className="admin-product-list">
            <h2>Manage Products</h2>
            <div className="product-list-header">
                <button className="product-btn" onClick={() => navigate('/admin/add-product')}>
                    Add New Product
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <span>{product.name}</span>
                        <div className="product-actions">
                            <button className="product-btn" onClick={() => handleEdit(product.id)}>
                                Edit
                            </button>
                            <button className="product-btn-delete" onClick={() => handleDelete(product.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {products.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </div>
    );
}

export default AdminProductPage;