export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured in environment variables' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['emmanuelojo291@gmail.com'],
        reply_to: email,
        subject: `[Portfolio Inquiry] ${name}: ${subject || 'New Project Discussion'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #09090b; margin-top: 0; font-size: 20px; border-bottom: 1px solid #f4f4f5; padding-bottom: 12px;">New Portfolio Message</h2>
            <p style="margin: 8px 0; color: #52525b; font-size: 14px;"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p style="margin: 8px 0; color: #52525b; font-size: 14px;"><strong>Project Scope:</strong> ${subject || 'General Inquiry'}</p>
            <div style="margin-top: 20px; padding: 16px; background-color: #f4f4f5; border-radius: 8px; color: #18181b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa; border-top: 1px solid #f4f4f5; padding-top: 12px;">
              Sent from Olabanji Ojo's Portfolio website. Hit "Reply" in your email client to reply straight to ${email}.
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to send via Resend' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

