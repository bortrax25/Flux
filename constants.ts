import { BrandAsset, ExpenseCategory, ExpenseType } from "./types";

export const INITIAL_BRANDS: BrandAsset[] = [
  { id: '1', name: 'Nike', logo: '👟', discountPercentage: 20, active: true, color: 'bg-orange-500', balance: 150 },
  { id: '2', name: 'Starbucks', logo: '☕', discountPercentage: 10, active: true, color: 'bg-green-600', balance: 45 },
  { id: '3', name: 'Zara', logo: '👗', discountPercentage: 15, active: false, color: 'bg-zinc-500', balance: 0 },
  { id: '4', name: 'Apple', logo: '🍎', discountPercentage: 5, active: false, color: 'bg-gray-200', balance: 0 },
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '#fbbf24', // Amber
  [ExpenseCategory.BEVERAGE]: '#34d399', // Emerald
  [ExpenseCategory.CLOTHING]: '#818cf8', // Indigo
  [ExpenseCategory.SERVICE]: '#f472b6', // Pink
  [ExpenseCategory.OTHER]: '#94a3b8', // Slate
};

export const MOCK_EXPENSES = [
  { id: '101', category: ExpenseCategory.BEVERAGE, type: ExpenseType.HORMIGA, amount: 12.50, item: 'Iced Latte', timestamp: Date.now() - 3600000 },
  { id: '102', category: ExpenseCategory.FOOD, type: ExpenseType.NECESARIO, amount: 25.00, item: 'Lunch Menu', timestamp: Date.now() - 18000000 },
];