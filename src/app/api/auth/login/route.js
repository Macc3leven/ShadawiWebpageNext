import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

// import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // TODO: replace with hash compare
    // const valid = await bcrypt.compare(password, user.passwordHash);
    const valid = password === user.passwordHash;

    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // TODO: set a session cookie or sign a JWT here
    return NextResponse.json({ ok: true, userId: user._id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
