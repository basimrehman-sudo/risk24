import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'travel-plans.json');

async function getTravelPlans() {
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
    const plans = await getTravelPlans();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPlan = await request.json();
    const plans = await getTravelPlans();
    
    const id = `TP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const planToSave = { 
      ...newPlan, 
      id,
      risks: newPlan.risks || [],
      score: 0 
    };
    
    plans.push(planToSave);
    await fs.writeFile(dataFilePath, JSON.stringify(plans, null, 2), 'utf-8');
    
    return NextResponse.json(planToSave, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
