import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'country-assessments.json');

async function getAssessments() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const records = await getAssessments();
    const record = records.find((p: any) => p.id === params.id);
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();
    const records = await getAssessments();
    
    const index = records.findIndex((p: any) => p.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    records[index] = { ...records[index], ...updatedData, id: params.id, lastUpdated: new Date().toISOString() };
    await fs.writeFile(dataFilePath, JSON.stringify(records, null, 2), 'utf-8');
    
    return NextResponse.json(records[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const records = await getAssessments();
    const newRecords = records.filter((p: any) => p.id !== params.id);
    await fs.writeFile(dataFilePath, JSON.stringify(newRecords, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
