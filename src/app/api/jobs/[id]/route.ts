import { NextResponse } from 'next/server';
import { readData, writeData, JobEntry } from '@/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedEntry: Omit<JobEntry, 'id'> = await request.json();
    const data = readData();
    
    const entryIndex = data.jobs.findIndex(j => j.id === id);
    if (entryIndex === -1) {
      return NextResponse.json({ error: 'Job entry not found' }, { status: 404 });
    }
    
    data.jobs[entryIndex] = { id, ...updatedEntry };
    writeData(data);
    
    return NextResponse.json(data.jobs[entryIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = readData();
    
    const entryIndex = data.jobs.findIndex(j => j.id === id);
    if (entryIndex === -1) {
      return NextResponse.json({ error: 'Job entry not found' }, { status: 404 });
    }
    
    data.jobs.splice(entryIndex, 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job entry' }, { status: 500 });
  }
}
