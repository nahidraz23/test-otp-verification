const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async (req, res) => {
    if (req.method === 'POST') {
        const { phoneNumber, code } = req.body;

        try {
            const verificationCheck = await client.verify
                .services(process.env.SERVICE_SID)
                .verificationChecks.create({ to: phoneNumber, code });
            res.status(200).json({ message: 'OTP verified', status: verificationCheck.status });
        } catch (error) {
            res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
