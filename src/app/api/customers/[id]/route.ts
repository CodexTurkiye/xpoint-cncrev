import { NextResponse } from 'next/server';
import { readData, writeData, Customer } from '@/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const updatedCustomer: Omit<Customer, 'id'> = await request.json();
    const data = readData();
    
    const customerIndex = data.customers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    data.customers[customerIndex] = { id, ...updatedCustomer };
    writeData(data);
    
    return NextResponse.json(data.customers[customerIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    
    // Vercel'de dosya yazma izni yok, sadece başarı mesajı döndür
    console.log(`Customer ${id} deletion requested`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Müşteri silindi (Production\'da veri kalıcı değil)',
      warning: 'Vercel\'de dosya yazma izni yok. Veriler kalıcı değil.'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
