export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  subcategoryId: number;
  inStock: boolean;
  image: string;
  unit: string;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  location: string;
  currency: string;
}

export interface ProductData {
  store: StoreInfo;
  products: Product[];
}
