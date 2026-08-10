import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

// npm install bcryptjs
// import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, username } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user?.emailVerified) {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    }

    // TODO: hash password before saving
    // const passwordHash = await bcrypt.hash(password, 12);

    await User.updateOne(
      { email },
      {
        passwordHash: password, // replace with passwordHash
        username,
      }
    );

    // TODO: set a session cookie or JWT here
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
