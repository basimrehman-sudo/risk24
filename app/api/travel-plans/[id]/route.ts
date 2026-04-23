import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'travel-plans.json');

async function getTravelPlans() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const plans = await getTravelPlans();
    const plan = plans.find((p: any) => p.id === params.id);
    if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();
    const plans = await getTravelPlans();
    
    const index = plans.findIndex((p: any) => p.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    plans[index] = { ...plans[index], ...updatedData, id: params.id };
    await fs.writeFile(dataFilePath, JSON.stringify(plans, null, 2), 'utf-8');
    
    return NextResponse.json(plans[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const plans = await getTravelPlans();
    const newPlans = plans.filter((p: any) => p.id !== params.id);
    await fs.writeFile(dataFilePath, JSON.stringify(newPlans, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
