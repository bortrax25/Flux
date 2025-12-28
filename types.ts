export enum ExpenseCategory {
  FOOD = 'Food',
  BEVERAGE = 'Beverage',
  CLOTHING = 'Clothing',
  SERVICE = 'Service',
  OTHER = 'Other'
}

export enum ExpenseType {
  HORMIGA = 'Hormiga', // Ant expenses (small, unnecessary)
  NECESARIO = 'Necesario',
  SERVICIO = 'Servicio'
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  type: ExpenseType;
  amount: number;
  item: string; // Product name
  brand?: string;
  imageUrl?: string;
  timestamp: number;
}

export interface BrandAsset {
  id: string;
  name: string;
  logo: string; // Emoji or URL
  discountPercentage: number;
  active: boolean;
  color: string;
  balance: number; // "Coins" or points
}

export interface UserState {
  dailyLimit: number;
  subscriptionActive: boolean;
}