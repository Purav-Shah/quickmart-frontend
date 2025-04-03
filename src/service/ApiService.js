import axios from "axios";

export default class ApiService {

    static BASE_URL = "http://localhost:8080";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /**AUTH && USERS API */
    static async registerUser(registration) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth-service/api/register`, registration);
            if (response.data.success) {
                const token = response.headers.authorization?.split(" ")[1];
                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(response.data.data));
                    return response.data;
                }
                throw new Error("No token received from server");
            }
            throw new Error(response.data.message || "Registration failed");
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async loginUser(loginDetails) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth-service/api/login`, loginDetails);
            if (response.data.success) {
                const token = response.headers.authorization?.split(" ")[1];
                if (token) {
                    localStorage.setItem("token", token);
                    // Store user data from auth response
                    const userData = response.data.data;
                    console.log("Auth response user data:", userData); // Debug log
                    
                    // Store user data
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("userId", userData.id);
                    
                    // Also store role separately for admin checks
                    localStorage.setItem("role", userData.role);
                    
                    return response.data;
                }
                throw new Error("No token received from server");
            }
            throw new Error(response.data.message || "Login failed");
        } catch (error) {
            console.error('Login error:', error); // Debug log
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    static async getUserByEmail(email) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/user/email/${email}`, {
                headers: {
                    ...this.getHeader(),
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/users`, {
                headers: {
                    ...this.getHeader(),
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/user/${id}`, {
                headers: {
                    ...this.getHeader(),
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user by id:', error);
            throw error;
        }
    }

    static async getLoggedInUserInfo() {
        try {
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            if (!userData || !userData.id) {
                throw new Error("No user information found");
            }
            console.log("Using stored user data:", userData); // Debug log
            return userData;
        } catch (error) {
            console.error('Error getting logged in user info:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        return !!(token && userId);
    }

    static isAdmin() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.role === "Admin";
    }

    static getUserName() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.name || "";
    }

    /**PRODUCT ENDPOINT */

    static async getAllProducts() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products`, {
                headers: this.getHeader()
            });
            return {
                productList: Array.isArray(response.data) ? response.data : []
            };
        } catch (error) {
            console.error('Error fetching all products:', error);
            return { productList: [] };
        }
    }

    static async getProductById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products/${id}`, {
                headers: this.getHeader()
            });
            return {
                product: response.data
            };
        } catch (error) {
            console.error('Error fetching product by id:', error);
            throw error;
        }
    }

    static async searchProducts(keyword) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products/search`, {
                headers: this.getHeader(),
                params: { keyword }
            });
            return {
                productList: Array.isArray(response.data) ? response.data : []
            };
        } catch (error) {
            console.error('Error searching products:', error);
            return { productList: [] };
        }
    }

    static async getAllProductsByCategoryId(categoryId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products/category/${categoryId}`, {
                headers: this.getHeader()
            });
            return {
                productList: Array.isArray(response.data) ? response.data : []
            };
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return { productList: [] };
        }
    }

    static async addProduct(productData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/products`, productData, {
                headers: this.getHeader()
            });
            return response;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    static async addInventoryItem(inventoryItem) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/inventory`, inventoryItem, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding inventory item:', error);
            throw error;
        }
    }

    static async updateProduct(productId, productData) {
        try {
            // Ensure we're sending the data in the correct format and handle null/undefined values
            const updateData = {
                id: productId,
                name: productData.name || '',
                description: productData.description || '',
                price: typeof productData.price === 'number' ? productData.price : 0,
                category: productData.category || '',
                imageUrl: productData.imageUrl || ''
            };

            // Validate required fields
            if (!updateData.name || !updateData.description || !updateData.category || !updateData.imageUrl) {
                throw new Error('Missing required fields');
            }

            const response = await axios.put(`${this.BASE_URL}/api/products/${productId}`, updateData, {
                headers: {
                    ...this.getHeader()
                }
            });
            return {
                status: 200,
                message: 'Product updated successfully',
                product: response.data
            };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            await axios.delete(`${this.BASE_URL}/api/products/${id}`, {
                headers: this.getHeader()
            });
            return {
                status: 200,
                message: 'Product deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    /**CATEGORY */
    static async getAllCategory() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/products`, {
                headers: this.getHeader()
            });
            if (response.data && Array.isArray(response.data)) {
                // Extract unique categories from products and filter out null/undefined
                const categories = [...new Set(response.data
                    .map(product => product.category)
                    .filter(category => category && category.trim() !== ''))];
                // Transform categories into the expected format
                return {
                    categoryList: categories.map(category => ({
                        id: category,
                        name: category
                    }))
                };
            }
            return { categoryList: [] };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { categoryList: [] };
        }
    }

    static async getProductsByCategory(category) {
        const response = await axios.get(`${this.BASE_URL}/api/products/category/${category}`);
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/api/products/categories/${categoryId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**ORDER */
    static async getAllOrders() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/orders`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error;
        }
    }

    static async createOrder(orderRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/orders`, orderRequest, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    static async getOrderById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/orders/${id}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order by id:', error);
            throw error;
        }
    }

    static async getOrdersByUserId(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/orders/user/${userId}`, {
                headers: this.getHeader()
            });
            // Orders will already be sorted by backend
            return response.data;
        } catch (error) {
            console.error('Error fetching orders by user id:', error);
            throw error;
        }
    }

    // Remove one of the duplicate getAllOrders methods
    static async getAllOrders() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/orders`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error;
        }
    }

    static async updateOrderStatus(id, status) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/orders/${id}/status`, {}, {
                headers: this.getHeader(),
                params: { status }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    /**ADDRESS */
    static async saveAddress(body) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/users/addresses`, body, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error saving address:', error);
            throw error;
        }
    }

    /**INVENTORY */
    static async checkInventory(productIds) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/inventory/check`, {
                headers: this.getHeader(),
                params: { productIds }
            });
            return response.data;
        } catch (error) {
            console.error('Error checking inventory:', error);
            throw error;
        }
    }

    static async getInventoryByProductId(productId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/inventory/${productId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory by product id:', error);
            throw error;
        }
    }

    static async updateInventory(productId, quantityChange) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/inventory/${productId}`, {}, {
                headers: this.getHeader(),
                params: { quantityChange }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating inventory:', error);
            throw error;
        }
    }

    /**PAYMENT */
    static async processPayment(paymentRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/payments/process`, paymentRequest, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    static async getPaymentById(paymentId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/payments/${paymentId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching payment by id:', error);
            throw error;
        }
    }

    static async getPaymentsByOrderId(orderId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/payments/order/${orderId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching payments by order id:', error);
            throw error;
        }
    }

    static async getPaymentsByUserId(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/payments/user/${userId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching payments by user id:', error);
            throw error;
        }
    }

    static async updateUserRole(userId, newRole) {
        try {
            console.log('Sending role update request:', { userId, newRole }); // Debug log
            
            // First, get the existing user
            const existingUser = await this.getUserById(userId);
            console.log('Existing user:', existingUser); // Debug log
            
            // Prepare the update request with all user data
            const updateRequest = {
                id: userId,
                email: existingUser.data.email,
                name: existingUser.data.name,
                role: newRole
            };
            
            console.log('Update request:', updateRequest); // Debug log
            
            const response = await axios.put(`${this.BASE_URL}/api/user/${userId}/role`, 
                updateRequest,
                {
                    headers: {
                        ...this.getHeader(),
                        'Accept': 'application/json'
                    }
                }
            );
            console.log('Role update response:', response); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/user/${userId}`, {
                headers: {
                    ...this.getHeader(),
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}