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
    // Use 'gmail' service with forced IPv4 to prevent timeouts on some cloud providers
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Force IPv4 as IPv6 can cause timeouts on some networks
        family: 4,
        // Increase timeouts significantly
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000
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
