import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../style/addProduct.css'
import ApiService from "../../service/ApiService";

const EditProductPage = () => {
    const {productId} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (productId) {
            ApiService.getProductById(productId).then((response)=>{
                const product = response.product;
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    imageUrl: product.imageUrl
                });
            });
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // First validate the raw form data
            if (!formData.name || !formData.description || !formData.category || !formData.imageUrl || !formData.price) {
                setMessage({ text: 'Please fill in all fields correctly', type: 'error' });
                return;
            }

            // Then process and format the data
            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                category: formData.category.trim(),
                imageUrl: formData.imageUrl.trim()
            };

            // Additional validation for processed data
            if (productData.price <= 0 || isNaN(productData.price)) {
                setMessage({ text: 'Please enter a valid price greater than 0', type: 'error' });
                return;
            }

            if (!productData.imageUrl.startsWith('http')) {
                setMessage({ text: 'Please enter a valid image URL starting with http:// or https://', type: 'error' });
                return;
            }

            const response = await ApiService.updateProduct(productId, productData);
            if (response.status === 200) {
                setMessage({ text: 'Product updated successfully', type: 'success' });
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                    navigate('/admin/products');
                }, 3000);
            }
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || error.message || 'Unable to update product',
                type: 'error'
            });
        }
    };

    const handleCancel = () => {
        navigate('/admin/products');
    };

    return (
        <div className="add-product-container">
            <h2>Edit Product</h2>
            {message.text && (
                <div className={`message ${message.type === 'success' ? 'success' : ''}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter product name"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter product description"
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        required
                        placeholder="Enter price"
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        placeholder="Enter category"
                    />
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                </div>

                {formData.imageUrl && (
                    <div className="form-group">
                        <label>Image Preview</label>
                        <div className="image-preview">
                            <img src={formData.imageUrl} alt="Product preview" style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                marginTop: '8px'
                            }} />
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;