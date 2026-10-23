import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const foods = await Food.find().sort({ createdAt: -1 });
      return NextResponse.json({ foods });
    }
    return NextResponse.json({ foods: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();
    if (db) {
      const food = await Food.create(body);
      return NextResponse.json({ food }, { status: 201 });
    }
    return NextResponse.json({ food: { ...body, _id: 'local_' + Date.now() } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
