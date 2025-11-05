import { NextResponse } from 'next/server';
import { readData, writeData, getNextId, Order } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newOrder: Omit<Order, 'id'> = await request.json();
    const data = readData();
    
    const order: Order = {
      id: getNextId(data.orders),
      ...newOrder
    };
    
    data.orders.push(order);
    writeData(data);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}



