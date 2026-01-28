// User & Auth Types
export type UserRole = 'ROLE_CUSTOMER' | 'ROLE_SELLER' | 'ROLE_ADMIN';
export type UserType = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  type: UserType;
  verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CustomerRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  shippingAddress: string;
  billingAddress: string;
}

export interface SellerRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  shopName: string;
  shopDescription: string;
  bankAccount: string;
}

// Customer
export interface Customer extends User {
  shippingAddress: string;
  billingAddress: string;
  wishlist?: Product[];
}

// Seller
export interface Seller extends User {
  shopName: string;
  shopDescription: string;
  bankAccount: string;
  verified: boolean;
}

// Category
export interface Category {
  id: string;
  name: string;
  description: string;
  children: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
  parentId?: string | null;
}

// Product
export interface ProductSeller {
  id: string;
  shopName: string;
  verified: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
  category: ProductCategory;
  seller: ProductSeller;
  avgRating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: string;
  images: string[];
  isActive: boolean;
}

export interface ProductsParams {
  categoryId?: string;
  sellerId?: string;
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Cart
export interface CartItemProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export interface CartItem {
  id: string;
  product: CartItemProduct;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Order
export interface OrderCustomer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface OrderItemProduct {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  product: OrderItemProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  customer: OrderCustomer;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Review
export interface ReviewCustomer {
  id: string;
  firstName: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  customer: ReviewCustomer;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

// Stats
export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

// Admin
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  type: UserType;
  verified?: boolean;
}

export interface UpdateUserRolesRequest {
  roles: UserRole[];
}
