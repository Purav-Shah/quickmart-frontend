import React from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminPage.css'


const AdminPage = () => {
    const navigate = useNavigate();

    return(
        <div className="admin-page">
            <h1>Welcome Admin</h1>
            <div className="admin-options">
                <button onClick={()=> navigate("/admin/products")}>Manage Products</button>
                <button onClick={()=> navigate("/admin/inventory")}>Manage Inventory</button>
                <button onClick={()=> navigate("/admin/orders")}>Manage Orders</button>
                <button onClick={()=> navigate("/admin/users")}>Manage Users</button>
            </div>
        </div>
    )
}

export default AdminPage;