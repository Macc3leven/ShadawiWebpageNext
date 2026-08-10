import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email });

    if (!user || !user.otpCode || !user.otpExpires) {
      return NextResponse.json({ error: "No code found. Request a new one." }, { status: 400 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }

    // TODO: compare hashed code
    // const valid = await bcrypt.compare(code, user.otpCode);
    const valid = code === user.otpCode; // replace with hash compare

    if (!valid) return NextResponse.json({ error: "Invalid code." }, { status: 400 });

    await User.updateOne({ email }, { emailVerified: true, otpCode: null, otpExpires: null });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
