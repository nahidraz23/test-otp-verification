const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async (req, res) => {
    if (req.method === 'POST') {
        const { phoneNumber } = req.body;

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
