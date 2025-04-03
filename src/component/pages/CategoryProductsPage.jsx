import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import '../../style/home.css'

const CategoryProductsPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, [categoryId, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ApiService.getAllProductsByCategoryId(categoryId);
            const allProducts = response.productList || [];
            
            if (allProducts.length === 0) {
                setError('No products found in this category');
                setProducts([]);
                setTotalPages(0);
            } else {
                setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
                setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch products by category');
            setProducts([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="home">
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <h2>Products in {categoryId}</h2>
                    <ProductList products={products} />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoryProductsPage;