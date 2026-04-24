import { NextResponse } from 'next/server';

// NOTE: Because each Next.js API route file is its own module in the serverless
// environment, we maintain a second reference here. For a real app use a
// database (Supabase, PlanetScale, MongoDB Atlas — all have free tiers).
// For this prototype, changes made here are reflected within the same
// serverless instance lifetime.

let assessments: any[] = [
  {
    id: "CA-0001",
    country: "Pakistan",
    status: "APPROVED",
    riskRating: "HIGH",
    riskLevel: 72,
    createdBy: "Admin",
    lastUpdated: new Date().toISOString(),
    summary: "Pakistan continues to face significant security challenges including terrorism, sectarian violence, and political instability. Urban centers remain relatively safer but require heightened vigilance. Border regions with Afghanistan present extreme risk.",
    regions: ["Balochistan", "KPK", "FATA", "Karachi"],
    matrix: [
      { id: 1, factor: "Political Violence and Terrorism", impact: 5, probability: 4, score: 20, rating: "Extreme", threatDescription: "Active militant groups operating across multiple provinces.", mitigation: "Avoid non-essential travel to conflict zones. Use vetted local contacts." },
      { id: 2, factor: "Crime and Lawlessness", impact: 3, probability: 3, score: 9, rating: "Medium", threatDescription: "Petty crime and targeted robberies in urban areas.", mitigation: "Avoid displaying valuables. Travel in groups." }
    ]
  },
  {
    id: "CA-0002",
    country: "Nigeria",
    status: "APPROVED",
    riskRating: "HIGH",
    riskLevel: 68,
    createdBy: "Admin",
    lastUpdated: new Date().toISOString(),
    summary: "Nigeria faces ongoing security threats from Boko Haram in the northeast, banditry in the northwest, and intercommunal violence in the Middle Belt. Lagos and Abuja require standard urban security precautions.",
    regions: ["Borno", "Zamfara", "Kaduna", "Lagos"],
    matrix: [
      { id: 3, factor: "Detention and Kidnap", impact: 5, probability: 3, score: 15, rating: "Extreme", threatDescription: "Kidnap for ransom remains a major threat, especially for foreign nationals.", mitigation: "Mandatory tracking for all personnel. Vetted drivers only." }
    ]
  },
  {
    id: "CA-0003",
    country: "Colombia",
    status: "UNDER REVIEW",
    riskRating: "MEDIUM",
    riskLevel: 45,
    createdBy: "Admin",
    lastUpdated: new Date().toISOString(),
    summary: "Colombia has seen significant security improvements following peace agreements, but dissident FARC groups and ELN remain active in rural areas. Major cities are generally safe with standard precautions.",
    regions: ["Chocó", "Cauca", "Nariño"],
    matrix: []
  },
  {
    id: "CA-0004",
    country: "UAE",
    status: "APPROVED",
    riskRating: "LOW",
    riskLevel: 12,
    createdBy: "Admin",
    lastUpdated: new Date().toISOString(),
    summary: "The UAE maintains one of the lowest crime rates globally. The primary risks are related to strict local laws and cyber threats. Travel is generally safe for all personnel.",
    regions: ["Dubai", "Abu Dhabi"],
    matrix: [
      { id: 4, factor: "Cyber Crimes", impact: 2, probability: 3, score: 6, rating: "Medium", threatDescription: "Phishing and financial scams targeting foreign nationals.", mitigation: "Use VPN. Do not access sensitive systems on public WiFi." }
    ]
  }
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const record = assessments.find((p) => p.id === params.id);
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();
    const index = assessments.findIndex((p) => p.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    assessments[index] = {
      ...assessments[index],
      ...updatedData,
      id: params.id,
      lastUpdated: new Date().toISOString()
    };
    return NextResponse.json(assessments[index]);
  } catch (error) {
    console.error('PUT /api/country-assessments/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const before = assessments.length;
    assessments = assessments.filter((p) => p.id !== params.id);
    if (assessments.length === before) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/country-assessments/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete assessment' }, { status: 500 });
  }
}
