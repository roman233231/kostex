import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email обов'язковий" }, { status: 400 });
    }

    const resetLink = await adminAuth.generatePasswordResetLink(email, {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #ffffff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #8B5CF6; margin: 0; font-size: 28px;">KOSTEX 🚀</h1>
        </div>
        <h2 style="color: #1f2937; font-size: 20px;">Привіт! 👋</h2>
        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
          Ми отримали запит на скидання пароля для твого акаунта на сайті <strong>KOSTEX</strong>.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #8B5CF6, #A855F7); color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Змінити пароль 🔑
          </a>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          Якщо кнопка не працює, скопіюй це посилання:<br/>
          <a href="${resetLink}" style="color: #8B5CF6; word-break: break-all;">${resetLink}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 13px; color: #6b7280;">
          🛡️ Якщо ти не робив цього запиту, просто проігноруй цей лист.
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "KOSTEX <onboarding@resend.dev>", 
      to: email,
      subject: "🔐 Відновлення пароля на сайті KOSTEX",
      html: html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Помилка відправки" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("API error:", error);
    if (error.code === 'auth/user-not-found' || error.message?.includes('user-not-found')) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Внутрішня помилка" }, { status: 500 });
  }
}
