require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*'
}));

const sendEmail = async (to, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host:'mail.highlandpathfinders.co.ke',
            port: 465 , // Ensure port is a number
            secure:true,  // `true` for 465, `false` for others
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            requireTLS: true,  // Force TLS if needed
            tls: {
                rejectUnauthorized: false  // Avoid SSL issues (try removing if it works without)
            },
            debug: true  // Enable debugging
        });

        const mailOptions = {
            from: `"info@highlandpathfinders.co.ke" <${process.env.EMAIL_USER}>`, 
            to,
            subject,
            text: body,
            html: `<h3>${subject}</h3><p>${body}</p>`
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
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const result = await sendEmail(email, subject, message);

        res.status(200).json({ success: true, message: "Email sent successfully", result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
    }
});
app .get('/email', (req, res) => {
    res.send('his is nodemailer, Welcome!')
});
const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port  ${PORT}`);
})
