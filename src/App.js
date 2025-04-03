import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './service/Guard';
import Navbar from './component/common/Navbar';
import Footer from './component/common/footer';
import { CartProvider } from './component/context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './component/pages/Home';
import ProductDetailsPage from './component/pages/ProductDetailsPage';
import CategoryListPage from './component/pages/CategoryListPage';
import CategoryProductsPage from './component/pages/CategoryProductsPage';
import CartPage from './component/pages/CartPage';
import RegisterPage from './component/pages/RegisterPage';
import LoginPage from './component/pages/LoginPage';
import ProfilePage from './component/pages/ProfilePage';
import AddressPage from './component/pages/AddressPage';
import AdminPage from './component/admin/AdminPage';
import AdminProductPage from './component/admin/AdminProductPage';
import AddProductPage from './component/admin/AddProductPage';
import EditProductPage from './component/admin/EditProductPage';
import AdminInventoryPage from './component/admin/AdminInventoryPage';
import AdminOrdersPage from './component/admin/AdminOrderPage';
import AdminOrderDetailsPage from './component/admin/AdminOrderDetailsPage';
import CheckoutPage from './component/pages/CheckoutPage';
import OrderSuccessPage from './component/pages/OrderSuccessPage';
import OrdersPage from './component/pages/OrdersPage';
import AdminUsersPage from './component/admin/AdminUsersPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-container">
          <Navbar/>
          <main className="content-wrapper">
            <Routes>
              {/* Public Routes */}
              <Route exact path='/' element={<Home/>}/>
              <Route path='/product/:productId' element={<ProductDetailsPage/>} />
              <Route path='/categories' element={<CategoryListPage/>}/>
              <Route path='/category/:categoryId' element={<CategoryProductsPage/>} />
              <Route path='/cart' element={<CartPage/>}/>
              <Route path='/register' element={<RegisterPage/>}/>
              <Route path='/login' element={<LoginPage/>}/>

              {/* Protected Routes */}
              <Route path='/profile' element={<ProtectedRoute element={<ProfilePage/>} />} />
              <Route path='/add-address' element={<ProtectedRoute element={<AddressPage/>} />} />
              <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage/>} />} />
              <Route path='/checkout' element={<ProtectedRoute element={<CheckoutPage/>} />} />
              <Route path='/order-success' element={<ProtectedRoute element={<OrderSuccessPage/>} />} />
              <Route path='/orders' element={<ProtectedRoute element={<OrdersPage/>} />} />

              {/* Admin Routes */}
              <Route path='/admin' element={<AdminRoute element={<AdminPage/>} />} />
              <Route path='/admin/products' element={<AdminRoute element={<AdminProductPage/>} />} />
              <Route path='/admin/add-product' element={<AdminRoute element={<AddProductPage/>} />} />
              <Route path='/admin/edit-product/:productId' element={<AdminRoute element={<EditProductPage/>} />} />
              <Route path='/admin/inventory' element={<AdminRoute element={<AdminInventoryPage/>} />} />
              <Route path='/admin/orders' element={<AdminRoute element={<AdminOrdersPage/>} />} />
              <Route path='/admin/order-details/:itemId' element={<AdminRoute element={<AdminOrderDetailsPage/>} />} />
              <Route path='/admin/users' element={<ProtectedRoute element={<AdminUsersPage/>} />} />
            </Routes>
          </main>
          <Footer/>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
