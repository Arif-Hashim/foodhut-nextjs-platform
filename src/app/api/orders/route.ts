import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    }
    return NextResponse.json({ orders: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();
    if (db) {
      const order = await Order.create(body);
      return NextResponse.json({ order }, { status: 201 });
    }
    return NextResponse.json({ order: { ...body, _id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), createdAt: new Date() } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
