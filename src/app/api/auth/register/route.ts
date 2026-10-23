import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const db = await connectDB();
    const passwordHash = await bcrypt.hash(password, 10);

    if (db) {
      const existing = await User.findOne({ email });
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      const user = await User.create({ name, email, passwordHash, role: role || 'customer' });
      const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
      return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    }

    // Fallback if MongoDB URI isn't configured yet
    const token = signToken({ userId: 'local_' + Date.now(), email, role: role || 'customer' });
    return NextResponse.json({ user: { id: 'local_' + Date.now(), name, email, role: role || 'customer' }, token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
