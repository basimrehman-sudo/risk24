import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'country-assessments.json');

async function getAssessments() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFilePath, '[]', 'utf-8');
      return [];
    }
    throw error;
  }
}

export async function GET() {
  try {
    const records = await getAssessments();
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newRecord = await request.json();
    const records = await getAssessments();
    
    const id = `CA-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const recordToSave = { 
      ...newRecord, 
      id,
      matrix: newRecord.matrix || [],
      regions: newRecord.regions || [],
      lastUpdated: new Date().toISOString()
    };
    
    records.push(recordToSave);
    await fs.writeFile(dataFilePath, JSON.stringify(records, null, 2), 'utf-8');
    
    return NextResponse.json(recordToSave, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
