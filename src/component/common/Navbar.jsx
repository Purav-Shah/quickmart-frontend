import React, {useState} from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ThemeToggle from "../../components/ThemeToggle";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";

const Navbar = () =>{

    const [searchValue, setSearchValue] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const showSearch = location.pathname !== '/cart';

    return(
        <nav className="navbar navbar-bg">
            <div className="navbar-brand">
                <NavLink to="/" className="text-reset"> <h1 className="navHeader">QuickMart</h1></NavLink>
            </div>
            {/* SEARCH FORM */}
            {showSearch && (
                <form className="navbar-search" onSubmit={handleSearchSubmit}>
                    <input type="text" 
                    placeholder="Search products" 
                    value={searchValue}
                    onChange={handleSearchChange} />
                    <button type="submit"><FaSearch /></button>
                </form>
            )}

            <button className="hamburger-menu" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`navbar-link ${menuOpen ? 'show' : ''}`}>
                <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
                {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
                {!isAuthenticated && <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>}
                {isAuthenticated && (
                    <NavLink to="/profile" className="user-name" onClick={() => setMenuOpen(false)}>
                        Welcome, {userName}
                    </NavLink>
                )}
                <NavLink to="/cart" onClick={() => setMenuOpen(false)}><FaShoppingCart className="cart-icon" /></NavLink>
                <ThemeToggle />
            </div>
        </nav>
    );

};

export default Navbar;