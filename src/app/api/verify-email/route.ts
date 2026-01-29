import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const apiKey = process.env.EMAILABLE_API_KEY;

    try {
        const response = await fetch(`https://api.emailable.com/v1/verify?email=${encodeURIComponent(email)}&api_key=${apiKey}`);
        const data = await response.json();

        // Según Emailable, 'deliverable' es un correo válido y seguro para enviar.
        // 'risky' o 'undeliverable' podrían ser rechazados dependiendo de la política.
        // Aquí seremos estrictos para cumplir con la petición del usuario.
        const isValid = data.state === 'deliverable';

        return NextResponse.json({
            isValid,
            state: data.state,
            reason: data.reason
        });
    } catch (error) {
        console.error('Error verifying email with Emailable:', error);
        // En caso de error técnico, permitimos el registro para no bloquear al usuario,
        // o podrías elegir bloquearlo. Aquí optamos por permitir.
        return NextResponse.json({ isValid: true, error: 'Verification service error' });
    }
}
