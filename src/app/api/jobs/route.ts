import { NextResponse } from 'next/server';
import { readData, writeData, getNextId, JobEntry } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newEntry: Omit<JobEntry, 'id'> = await request.json();
    const data = readData();
    
    const entry: JobEntry = {
      id: getNextId(data.jobs),
      ...newEntry
    };
    
    data.jobs.push(entry);
    writeData(data);
    
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job entry' }, { status: 500 });
  }
}





