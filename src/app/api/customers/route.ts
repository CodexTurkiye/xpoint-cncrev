import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { Customer } from '@/lib/data';

export async function GET() {
  try {
    const collection = await getCollection('customers');
    const customers = await collection.find({}).toArray();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCustomer: Omit<Customer, 'id'> = await request.json();
    const collection = await getCollection('customers');
    
    const customer: Customer = {
      id: Date.now(),
      ...newCustomer
    };
    
    await collection.insertOne(customer);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
