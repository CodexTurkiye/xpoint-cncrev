import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

export interface Customer {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  material: string;
  thickness: string;
  stock: number;
  unitPrice: number;
  supplier: string;
  lastRestock: string;
  minStock: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerCompany: string;
  workDescription: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  paymentStatus: 'pending' | 'partial' | 'paid';
  notes: string;
}

export interface InventoryEntry {
  id: number;
  productName: string;
  category: string;
  supplier: string;
  supplierLocation: string;
  supplierContact: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  shippingCost: number;
  entryDate: string;
  notes: string;
}

export interface CostEntry {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  supplier?: string;
  notes: string;
}

export interface JobEntry {
  id: number;
  customerName: string;
  jobTitle: string;
  deliveryDate: string;
  notes: string;
  items: JobItem[];
  costs: JobCost[];
  createdAt: string;
}

export interface JobItem {
  id: number;
  description: string;
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface JobCost {
  id: number;
  description: string;
  amount: number;
  type: 'material' | 'labor' | 'shipping' | 'other';
}

export interface Database {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  inventory: InventoryEntry[];
  costs: CostEntry[];
  jobs: JobEntry[];
}

export function readData(): Database {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return {
      customers: [],
      products: [],
      orders: [],
      inventory: [],
      costs: [],
      jobs: []
    };
  }
}

export function writeData(data: Database): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to save data');
  }
}

export function getNextId(items: any[]): number {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}
