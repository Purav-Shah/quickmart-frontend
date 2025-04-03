import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HomeCarousel from '../home/HomeCarousel';
import ProductCard from '../common/ProductCard';
import ApiService from '../../service/ApiService';
import '../../style/homePage.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        if (searchTerm) {
            searchProducts();
        } else {
            fetchFeaturedProducts();
        }
    }, [searchTerm]);

    const searchProducts = async () => {
        try {
            setLoading(true);
            const response = await ApiService.searchProducts(searchTerm);
            setProducts(response.productList);
        } catch (error) {
            console.error('Error searching products:', error);
            setError('Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllProducts();
            const featured = response.productList.slice(0, 8);
            setProducts(featured);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setError('Failed to load featured products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="carousel-wrapper">
                {!searchTerm && <HomeCarousel />}
            </div>
            
            <div className="content-container">
                <section className="featured-section">
                    <h2 className="section-title">
                        {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Products'}
                    </h2>
                    <p className="section-description">
                        {searchTerm 
                            ? `Found ${products.length} products matching your search`
                            : 'Discover our handpicked selection of top products'}
                    </p>
                    
                    {loading && <div className="loading">Loading products...</div>}
                    {error && <div className="error">{error}</div>}
                    
                    <div className="featured-products">
                        {products.length === 0 ? (
                            <div className="no-results">
                                <p>No products found matching your search.</p>
                            </div>
                        ) : (
                            products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;