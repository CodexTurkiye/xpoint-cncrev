import { NextResponse } from 'next/server';
import { readData, writeData, Order } from '@/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const updatedOrder: Omit<Order, 'id'> = await request.json();
    const data = readData();
    
    const orderIndex = data.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    data.orders[orderIndex] = { id, ...updatedOrder };
    writeData(data);
    
    return NextResponse.json(data.orders[orderIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const data = readData();
    
    const orderIndex = data.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    data.orders.splice(orderIndex, 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
