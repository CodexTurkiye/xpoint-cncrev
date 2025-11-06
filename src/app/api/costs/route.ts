import { NextResponse } from 'next/server';
import { readData, writeData, getNextId, CostEntry } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.costs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cost entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newEntry: Omit<CostEntry, 'id'> = await request.json();
    const data = readData();
    
    const entry: CostEntry = {
      id: getNextId(data.costs),
      ...newEntry
    };
    
    data.costs.push(entry);
    writeData(data);
    
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create cost entry' }, { status: 500 });
  }
}





