import React from "react";
import '../../style/footer.css';
import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <h2 className="footer-brand">Quickmart</h2>
                    <p>Your one-stop shop for all your needs.</p>
                </div>
                
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><NavLink to={"/"}>About Us</NavLink></li>
                        <li><NavLink to={"/"}>Contact Us</NavLink></li>
                        <li><NavLink to={"/"}>Terms & Conditions</NavLink></li>
                        {/* <li><NavLink to={"/"}>Privacy Policy</NavLink></li> */}
                        {/* <li><NavLink to={"/"}>FAQs</NavLink></li> */}
                    </ul>
                </div>
                
                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p>Email: support@quickmart.com</p>
                    <p>Phone: +1 (123) 456-7890</p>
                    <div className="social-icons">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
            <div className="footer-info">
                <p>&copy; 2024 Quick Mart. All rights reserved.</p>
            </div>
        </footer>
    )
}
export default Footer;