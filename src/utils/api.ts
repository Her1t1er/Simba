const API_BASE_URL = 'http://localhost:8081/api';

export const api = {
  async handleResponse(res: Response) {
    if (!res.ok) {
      let errorDetail = "";
      try {
        errorDetail = await res.text();
      } catch (e) {
        errorDetail = "Could not read error response body";
      }
      console.error(`API Error ${res.status}: ${errorDetail}`);
      throw new Error(errorDetail || `Request failed with status ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  async getProducts() {
    const res = await fetch(`${API_BASE_URL}/products`);
    return this.handleResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/products/categories`);
    return this.handleResponse(res);
  },

  async addProduct(productData: any) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return this.handleResponse(res);
  },

  async updateProduct(id: number, productData: any) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return this.handleResponse(res);
  },

  async deleteProduct(id: number) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse(res);
  },

  async deleteCategory(name: string) {
    const res = await fetch(`${API_BASE_URL}/products/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    return this.handleResponse(res);
  },

  async checkout(orderData: any) {
    const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return this.handleResponse(res);
  },

  // Auth
  async signup(data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  },

  async login(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(res);
  },

  async googleAuth(tokenId: string) {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenId }),
    });
    return this.handleResponse(res);
  },

  // Staff Orders
  async getBranchOrders(branchName: string) {
    const res = await fetch(`${API_BASE_URL}/orders/branch/${encodeURIComponent(branchName)}`);
    return this.handleResponse(res);
  },

  async updatePrepayment(id: number, status: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/prepayment?status=${status}`, {
      method: 'PATCH',
    });
    return this.handleResponse(res);
  },

  async updateOrderStatus(id: number, status: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
    return this.handleResponse(res);
  },

  // Inventory
  async getBranchInventory(branchName: string) {
    const res = await fetch(`${API_BASE_URL}/inventory/branch/${encodeURIComponent(branchName)}`);
    return this.handleResponse(res);
  },

  async toggleStock(inventoryId: number) {
    const res = await fetch(`${API_BASE_URL}/inventory/${inventoryId}/toggle`, {
      method: 'PATCH',
    });
    return this.handleResponse(res);
  },
};
