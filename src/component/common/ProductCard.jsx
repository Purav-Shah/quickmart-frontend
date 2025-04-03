import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/productCard.css';

const ProductCard = ({ product }) => {
    const { id, name, price, imageUrl, description } = product;

    return (
        <Link to={`/product/${id}`} className="product-card">
            <div className="product-image-container">
                <img 
                    src={imageUrl || 'https://via.placeholder.com/300x400'} 
                    alt={name}
                    className="product-image"
                />
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <div className="product-price">₹{price}</div>
            </div>
        </Link>
    );
};

export default ProductCard; 