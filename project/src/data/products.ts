import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // ...copy all products from Products.tsx...
];

// Add featured products
export const FEATURED_PRODUCTS = PRODUCTS.filter(product => 
  // Choose some criteria for featured products, e.g.:
  product.inStock && ['Spices', 'Dairy', 'Honey'].includes(product.category)
).slice(0, 6);
