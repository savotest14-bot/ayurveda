export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  categoryId?: number;
  category?: Category;
  featured: boolean;
  active: boolean;
  ingredients?: string;
  benefits?: string;
  usage?: string;
  weight?: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  image?: string;
  role: 'ADMIN' | 'CUSTOMER';
  isActive: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  product?: Product;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'COD_WHATSAPP' | 'RAZORPAY';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD_PENDING' | 'COD_CONFIRMED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  payments?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: number;
  storeName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagramUrl?: string;
  facebookUrl?: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  razorpayEnabled: boolean;
  announcementText: string;
  heroTagline: string;
  heroSubtitle: string;
  footerText: string;
}
