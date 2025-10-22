import { NextResponse } from 'next/server';
import { readData, writeData, getNextId, Customer } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCustomer: Omit<Customer, 'id'> = await request.json();
    
    // Vercel'de dosya yazma izni yok, sadece mock data döndür
    const customer: Customer = {
      id: Date.now(), // Unique ID
      ...newCustomer
    };
    
    console.log('New customer created:', customer);
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
