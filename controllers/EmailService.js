import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


const EmailService = async ({ name, email } = {}) => {
    if (!name || !email) {
        console.log("Error: 'name' or 'email' is missing.");
        return;
    }

    const html = `<p>Dear ${name}</p>
                  <p>Account Created Successfully</p>`;
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gladsonkalangiam@gmail.com',
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: 'gladsonkalangiam@gmail.com',
            to: email,
            subject: 'User Registration',
            html: html
        });

        console.log("Message sent: " + info.messageId);
    } catch (error) {
        console.log("Email sending error:", error);
    }
};


export default { EmailService }