import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.loginUser(formData);
            if (response.success) {
                // Store user data
                const userData = response.data;
                localStorage.setItem("userId", userData.id);
                localStorage.setItem("user", JSON.stringify(userData));
                
                toast.success("Successfully logged in!");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            toast.error(error.message || "Unable to login");
        }
    }

    return (
        <div className="register-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                    
                <label>Password: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required />

                <button type="submit">Login</button>
                    
                <p className="register-link">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    )
}

export default LoginPage;