import { NextResponse } from 'next/server';
import { readData, writeData, CostEntry } from '@/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedEntry: Omit<CostEntry, 'id'> = await request.json();
    const data = readData();
    
    const entryIndex = data.costs.findIndex(c => c.id === id);
    if (entryIndex === -1) {
      return NextResponse.json({ error: 'Cost entry not found' }, { status: 404 });
    }
    
    data.costs[entryIndex] = { id, ...updatedEntry };
    writeData(data);
    
    return NextResponse.json(data.costs[entryIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cost entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = readData();
    
    const entryIndex = data.costs.findIndex(c => c.id === id);
    if (entryIndex === -1) {
      return NextResponse.json({ error: 'Cost entry not found' }, { status: 404 });
    }
    
    data.costs.splice(entryIndex, 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete cost entry' }, { status: 500 });
  }
}
