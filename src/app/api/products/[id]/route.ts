import { NextResponse } from 'next/server';
import { readData, writeData, Product } from '@/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedProduct: Omit<Product, 'id'> = await request.json();
    const data = readData();
    
    const productIndex = data.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    data.products[productIndex] = { id, ...updatedProduct };
    writeData(data);
    
    return NextResponse.json(data.products[productIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = readData();
    
    const productIndex = data.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    data.products.splice(productIndex, 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
