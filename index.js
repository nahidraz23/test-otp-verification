const express = require('express')
const twilio = require('twilio')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5300
const app = express()

// Middleware to enable CORS
app.use(cors({
    origin: 'https://giveaway-1-dd908a.webflow.io', // Allow your Webflow domain
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    credentials: true // Allow cookies if needed
}));
app.use(express.json())
app.use(bodyParser.json())

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body

  try {
    const verification = await client.verify
      .services(process.env.SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: 'sms' })
    res
      .status(200)
      .send({ message: 'OTP sent successfully', status: verification.status })
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Failed to send OTP', details: error.message })
  }
})

app.post('/verify-otp', async (req, res) => {
  const { phoneNumber, code } = req.body

  try {
    const verificationCheck = await client.verify
      .services(process.env.SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code })
    res
      .status(200)
      .send({ message: 'OTP verified', status: verificationCheck.status })
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Failed to verify OTP', details: error.message })
  }
})

app.get('/', (req, res) => {
  res.send('Test OTP server is running')
})

app.listen(port, () => {
  console.log(`Test OTP server is running ${port}`)
})
