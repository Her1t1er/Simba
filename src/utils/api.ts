const API_BASE_URL = 'http://localhost:8081/api';

export const api = {
  async handleResponse(res: Response) {
    if (!res.ok) {
      let errorDetail = "";
      try {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          errorDetail = json.message || json.error || text;
        } catch (e) {
          errorDetail = text;
        }
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

  async getOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return this.handleResponse(res);
  },

  async getCustomerOrders(email: string) {
    const res = await fetch(`${API_BASE_URL}/orders/customer?email=${encodeURIComponent(email)}`);
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

  async verifyEmail(token: string) {
    const res = await fetch(`${API_BASE_URL}/auth/verify?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        return this.handleResponse(res);
    }
    return res.text();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    if (!res.ok) return this.handleResponse(res);
    return res.text();
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
      method: 'POST'
    });
    if (!res.ok) return this.handleResponse(res);
    return res.text();
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

  async updatePrepayment(id: number, status: string, declineReason?: string) {
    let url = `${API_BASE_URL}/orders/${id}/prepayment?status=${status}`;
    if (declineReason) {
      url += `&declineReason=${encodeURIComponent(declineReason)}`;
    }
    const res = await fetch(url, {
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
