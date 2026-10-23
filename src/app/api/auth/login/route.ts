import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const db = await connectDB();

    if (db) {
      const user = await User.findOne({ email });
      if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
      return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    }

    // Demo login if MongoDB isn't connected yet
    const token = signToken({ userId: 'demo_user', email, role: email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'customer' });
    return NextResponse.json({
      user: { id: 'demo_user', name: email.split('@')[0], email, role: email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'customer' },
      token
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
