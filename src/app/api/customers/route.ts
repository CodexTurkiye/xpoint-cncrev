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
    const data = readData();
    
    const customer: Customer = {
      id: getNextId(data.customers),
      ...newCustomer
    };
    
    data.customers.push(customer);
    writeData(data);
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
