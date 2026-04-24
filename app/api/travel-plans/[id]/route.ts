import { NextResponse } from 'next/server';

let travelPlans: any[] = [
  {
    id: "TP-0001",
    name: "Operation Blue Shield — Islamabad",
    status: "Active",
    dates: "May 12 – May 28, 2025",
    location: "Islamabad, Pakistan",
    travelers: "Team Alpha (4 Personnel)",
    riskStatus: "HIGH RISK",
    risks: [
      { id: 1, category: "Security", description: "Civil unrest near parliament during election period", severity: "High" },
      { id: 2, category: "Medical", description: "Limited trauma care facilities outside of major hospitals", severity: "Medium" }
    ]
  },
  {
    id: "TP-0002",
    name: "Executive Visit — Dubai HQ",
    status: "Planned",
    dates: "Jun 3 – Jun 7, 2025",
    location: "Dubai, UAE",
    travelers: "C-Suite Delegation (2 Personnel)",
    riskStatus: "LOW RISK",
    risks: []
  },
  {
    id: "TP-0003",
    name: "Field Assessment — Lagos",
    status: "Draft",
    dates: "Jun 20 – Jul 5, 2025",
    location: "Lagos, Nigeria",
    travelers: "Risk Team Bravo (3 Personnel)",
    riskStatus: "EXTREME RISK",
    risks: [
      { id: 3, category: "Kidnap & Ransom", description: "Foreign nationals targeted in Lekki and Victoria Island areas", severity: "Extreme" },
      { id: 4, category: "Health", description: "Malaria prophylaxis required. Yellow fever vaccination mandatory.", severity: "Medium" },
      { id: 5, category: "Infrastructure", description: "Unreliable power and communications in non-urban zones", severity: "Low" }
    ]
  }
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const plan = travelPlans.find((p) => p.id === params.id);
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();
    const index = travelPlans.findIndex((p) => p.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    travelPlans[index] = {
      ...travelPlans[index],
      ...updatedData,
      id: params.id
    };
    return NextResponse.json(travelPlans[index]);
  } catch (error) {
    console.error('PUT /api/travel-plans/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update travel plan' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const before = travelPlans.length;
    travelPlans = travelPlans.filter((p) => p.id !== params.id);
    if (travelPlans.length === before) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/travel-plans/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete travel plan' }, { status: 500 });
  }
}
