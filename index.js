const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const verification = await client.verify.services(process.env.SERVICE_SID)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
        res.status(200).send({ message: 'OTP sent successfully', status: verification.status });
    } catch (error) {
        res.status(500).send({ error: 'Failed to send OTP', details: error.message });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { phoneNumber, code } = req.body;

    try {
        const verificationCheck = await client.verify.services(process.env.SERVICE_SID)
            .verificationChecks
            .create({ to: phoneNumber, code });
        res.status(200).send({ message: 'OTP verified', status: verificationCheck.status });
    } catch (error) {
        res.status(500).send({ error: 'Failed to verify OTP', details: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
