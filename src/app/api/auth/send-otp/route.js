import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

// npm install bcryptjs
// import bcrypt from "bcryptjs";

// Sendgrid: npm install @sendgrid/mail
// import sgMail from "@sendgrid/mail";
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectDB();

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // TODO: hash the code before storing
    // const hash = await bcrypt.hash(code, 10);

    await User.findOneAndUpdate(
      { email },
      { otpCode: code /* swap for hash */, otpExpires: expires },
      { upsert: true, new: true }
    );

    // TODO: send email via SendGrid
    // await sgMail.send({
    //   to: email,
    //   from: "noreply@worldofshadawi.com",
    //   subject: "Your Shadawi verification code",
    //   text: `Your code is: ${code}`,
    // });

    console.log(`[DEV] OTP for ${email}: ${code}`); // remove in production

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
