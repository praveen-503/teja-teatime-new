// ─────────────────────────────────────────────
// CATEGORY
// ─────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

// ─────────────────────────────────────────────
// ADDON
// ─────────────────────────────────────────────
export interface Addon {
  name: string;
  price: number;
}

// ─────────────────────────────────────────────
// PRODUCT
// ─────────────────────────────────────────────
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isVeg: boolean;
  sugarLevels: string[];
  spiceLevels: string[];
  addons: Addon[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────
export interface CartItem {
  cartItemId: string;   // unique per customization combo
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sugarLevel?: string;
  spiceLevel?: string;
  selectedAddons: Addon[];
}

// ─────────────────────────────────────────────
// ORDER
// ─────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  sugarLevel?: string | null;
  spiceLevel?: string | null;
  addons: string[];
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

export interface Order {
  id: string;
  tableId: string;
  status: OrderStatus;
  total: number;
  notes?: string | null;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  table: {
    number: number;
    label: string;
  };
  orderItems: OrderItem[];
}

// ─────────────────────────────────────────────
// WAITER REQUEST
// ─────────────────────────────────────────────
export type WaiterRequestType = 'WATER' | 'BILL' | 'WAITER' | 'TISSUE';

export interface WaiterRequest {
  id: string;
  tableId: string;
  requestType: WaiterRequestType;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

// ─────────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────────
export interface Table {
  id: string;
  number: number;
  label: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────
// API RESPONSE
// ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─────────────────────────────────────────────
// CREATE ORDER PAYLOAD
// ─────────────────────────────────────────────
export interface CreateOrderPayload {
  tableNumber: number;
  items: {
    productId: string;
    quantity: number;
    sugarLevel?: string;
    spiceLevel?: string;
    addons?: string[];
  }[];
  notes?: string;
}
