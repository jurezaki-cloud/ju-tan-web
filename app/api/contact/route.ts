import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log("API CONTACT CALLED");
    const { name, email, message } = await req.json();
    console.log(name, email, message);

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: ["info@ju-tan.com"],
      subject: `Novo povpraševanje od ${name}`,
      replyTo: email,
      html: `
    <h2>Novo povpraševanje</h2>
    <p><strong>Ime:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p>${message}</p>
  `,
    });

    console.log(result);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("API CONTACT ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
