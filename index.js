require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*'
}));

const send = async (from, to, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `no-reply@${from}`,
            to,
            subject,
            text: body,
            html: `<h3>${subject}</h3><p>${body}</p>`,
            replyTo: `no-reply@${from}`,
        };

        const info = await transporter.sendMail(mailOptions);

        return info;

    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

app.post('/email', async (req, res) => {
    try {
        console.log(req.body);
        user = process.env.EMAIL_USER;
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            res.status(400).json({ message: "All field are required!" });
        }
        const result = await send(user, email, subject, message);
        if (result) {
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => console.log('Server started on port 3000'));
