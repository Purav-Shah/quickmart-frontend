import React, {useState} from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ThemeToggle from "../../components/ThemeToggle";

const Navbar = () =>{

    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();
    const userName = ApiService.getUserName();

    const handleSearchChange =(e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchSubmit = async (e) =>{
        e.preventDefault();
        navigate(`/?search=${searchValue}`)
    }

    const showSearch = location.pathname !== '/cart';

    return(
        <nav className="navbar navbar-bg">
            <div className="navbar-brand">
                <NavLink to="/" className="text-reset"> <h1 className="navHeader">Quickmart</h1></NavLink>
            </div>
            {/* SEARCH FORM */}
            {showSearch && (
                <form className="navbar-search" onSubmit={handleSearchSubmit}>
                    <input type="text" 
                    placeholder="Search products" 
                    value={searchValue}
                    onChange={handleSearchChange} />
                    <button type="submit">Search</button>
                </form>
            )}

            <div className="navbar-link">
                <NavLink to="/" >Home</NavLink>
                <NavLink to="/categories" >Categories</NavLink>
                {isAdmin && <NavLink to="/admin" >Admin</NavLink>}
                {!isAuthenticated && <NavLink to="/login" >Login</NavLink>}
                {isAuthenticated && (
                    <NavLink to="/profile" className="user-name">
                        Welcome, {userName}
                    </NavLink>
                )}
                <NavLink to="/cart">Cart</NavLink>
                <ThemeToggle />
            </div>
        </nav>
    );

};

export default Navbar;