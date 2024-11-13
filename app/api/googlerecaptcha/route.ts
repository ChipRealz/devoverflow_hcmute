import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'reCAPTCHA token is missing' }, { status: 400 });
  }

  try {
    const secretKey = process.env.NEXT_RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey || '',
        response: token,
      }).toString(),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ success: false, message: 'Failed reCAPTCHA verification' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'reCAPTCHA verification passed' });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during reCAPTCHA verification' }, { status: 500 });
  }
}
