import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.RESEND_API_KEY || env.RESEND || '';

  return {
    plugins: [
      react(),
      {
        name: 'resend-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/send', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const { name, email, subject, message } = JSON.parse(body || '{}');

                if (!name || !email || !message) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Name, email, and message are required' }));
                  return;
                }

                if (!apiKey) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'RESEND_API_KEY is not configured in .env' }));
                  return;
                }

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
                          Sent from Olabanji Ojo's Portfolio website. Hit "Reply" to message the sender directly at ${email}.
                        </p>
                      </div>
                    `,
                  }),
                });

                const data = (await response.json()) as any;
                if (!response.ok) {
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: data.message || 'Failed to send via Resend' }));
                  return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, data }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
              }
            });
          });
        },
      },
    ],
  };
});
