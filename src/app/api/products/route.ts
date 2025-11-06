import { NextResponse } from 'next/server';
import { readData, writeData, getNextId, Product } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProduct: Omit<Product, 'id'> = await request.json();
    const data = readData();
    
    const product: Product = {
      id: getNextId(data.products),
      ...newProduct
    };
    
    data.products.push(product);
    writeData(data);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}





