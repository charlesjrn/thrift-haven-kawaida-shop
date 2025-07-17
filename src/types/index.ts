
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'cashier';
  createdAt: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  size: string;
  price: number;
  stock: number;
  minStock: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'Whisky' 
  | 'Vodka' 
  | 'Beer' 
  | 'Wine' 
  | 'Soft Drinks' 
  | 'Gin' 
  | 'Rum' 
  | 'Brandy' 
  | 'Liqueur';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  cashierId: string;
  cashierName: string;
  timestamp: string;
  paymentMethod: 'cash' | 'mpesa' | 'card';
  mpesaTransactionId?: string;
}

export interface DashboardStats {
  totalSales: number;
  todaysSales: number;
  totalProducts: number;
  lowStockItems: number;
  totalStaff: number;
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalProfit: number;
  salesCount: number;
  bestSellingProducts: {
    productName: string;
    quantitySold: number;
    revenue: number;
  }[];
}
