const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log('Attempting to send email...');
    console.log('SMTP Config:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER ? '***Set***' : '***Missing***',
        pass: process.env.EMAIL_PASS ? '***Set***' : '***Missing***'
    });

    // Create a transporter
    // Switch to Port 587 (STARTTLS) which is often more reliable for timeouts
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000
    });

    // Verify connection configuration
    try {
        await transporter.verify();
        console.log('SMTP Connection verified successfully');
    } catch (error) {
        console.error('SMTP Connection Verification Failed:', error);
        throw error;
    }

    // Define the email options
    const mailOptions = {
        from: `${process.env.FROM_NAME || 'Bharat Swaraj'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
};

module.exports = sendEmail;
