const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async (req, res) => {
    const allowedOrigins = [
        'https://giveaway-1-dd908a.webflow.io',
        'https://www.goat-giveaways.com'
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method === 'POST') {
        // const { phoneNumber } = req.body;

        try {
            const verification = await client.verify
                .services(process.env.SERVICE_SID)
                .verifications.create({ to: phoneNumber, channel: 'sms' });

            res.status(200).json({ message: 'OTP sent successfully', status: verification.status });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send OTP', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
