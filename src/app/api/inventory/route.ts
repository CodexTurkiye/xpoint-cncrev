import { NextResponse } from 'next/server';
import { readData, writeData, getNextId, InventoryEntry } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newEntry: Omit<InventoryEntry, 'id'> = await request.json();
    const data = readData();
    
    const entry: InventoryEntry = {
      id: getNextId(data.inventory),
      ...newEntry
    };
    
    data.inventory.push(entry);
    writeData(data);
    
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory entry' }, { status: 500 });
  }
}





