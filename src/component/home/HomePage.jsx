import React, { useEffect, useState } from 'react';
import HomeCarousel from './HomeCarousel';
import ProductCard from '../product/ProductCard';
import ApiService from '../../service/ApiService';
import '../../style/homePage.css';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllProducts();
            // Get the first 8 products as featured products
            const featured = response.productList.slice(0, 8);
            setFeaturedProducts(featured);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setError('Failed to load featured products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <HomeCarousel />
            
            <div className="container">
                <section className="featured-section">
                    <h2 className="section-title">Featured Products</h2>
                    <p className="section-description">
                        Discover our handpicked selection of top products
                    </p>
                    
                    {loading && <div className="loading">Loading featured products...</div>}
                    {error && <div className="error">{error}</div>}
                    
                    <div className="featured-products">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                
            </div>
        </div>
    );
};

export default HomePage; 