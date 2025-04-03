import React, { useState, useEffect } from 'react';
import '../../style/homeCarousel.css';

const HomeCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageErrors, setImageErrors] = useState({});

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
            title: 'Welcome to Quick Commerce',
            description: 'Your One-Stop Shopping Destination',
            buttonText: 'Shop Now',
            buttonLink: '/categories'
        },
        {
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            title: 'Fashion Trends 2024',
            description: 'Discover the latest styles and trends',
            buttonText: 'Shop Fashion',
            buttonLink: '/category/Fashion'
        },
        {
            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
            title: 'Electronics & Gadgets',
            description: 'Explore cutting-edge technology',
            buttonText: 'View Electronics',
            buttonLink: '/category/Electronics'
        },
        {
            image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
            title: 'Books & Media',
            description: 'Dive into a world of stories and knowledge',
            buttonText: 'Explore Books',
            buttonLink: '/category/Books'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === slides.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === slides.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    const handleImageError = (index) => {
        setImageErrors(prev => ({
            ...prev,
            [index]: true
        }));
    };

    return (
        <div className="carousel-container">
            <div className="carousel">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ 
                            transform: `translateX(${(index - currentSlide) * 100}%)`,
                            opacity: index === currentSlide ? 1 : 0,
                            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'
                        }}
                    >
                        <div className="carousel-image">
                            <img 
                                src={imageErrors[index] ? slides[0].image : slide.image} 
                                alt={slide.title}
                                onError={() => handleImageError(index)}
                            />
                        </div>
                        <div className="carousel-content">
                            <h2>{slide.title}</h2>
                            <p>{slide.description}</p>
                            <a href={slide.buttonLink} className="carousel-button">
                                {slide.buttonText}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-control prev" onClick={prevSlide}>
                ‹
            </button>
            <button className="carousel-control next" onClick={nextSlide}>
                ›
            </button>

            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeCarousel; 