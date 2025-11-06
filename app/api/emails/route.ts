import { NextResponse } from 'next/server';
import { saveEmail, getEmails } from '@/lib/emails';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email est requis' }, { status: 400 });
    }

    const newEmail = await saveEmail(email);
    return NextResponse.json(newEmail, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const emails = await getEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
