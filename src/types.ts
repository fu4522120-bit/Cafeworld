export type OrderMode = 'dine-in' | 'takeaway' | 'delivery';

export type CategoryId = 'hot-brews' | 'cold-drinks' | 'savoury-mains' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isAvailable: boolean;
  tags: string[];
  sizes?: { name: string; priceDiff: number }[];
  milkOptions?: string[];
  sweetnessLevels?: string[];
  allowExtraShot?: boolean;
  prepTimeMinutes: number;
  calories?: number;
}

export interface CustomizationSelection {
  size?: string;
  milk?: string;
  sweetness?: string;
  extraShot?: boolean;
  notes?: string;
  unitPrice: number;
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  customization?: CustomizationSelection;
  totalPrice: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  ticketNumber: string; // e.g. #CP-1044
  createdAt: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    customizationSummary?: string;
  }[];
  orderMode: OrderMode;
  tableNumber?: string;
  deliveryAddress?: string;
  customerPhone?: string;
  customerName?: string;
  subtotal: number;
  tax: number; // 16% GST
  discount: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
  estimatedMinutes: number;
}
