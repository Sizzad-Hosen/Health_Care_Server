import nodemailer from 'nodemailer'
import config from '../../config';


const emailSender = async (
    email: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: config.email,
            pass: config.app_pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Health Care" <sizzadhosen@gmail.com>', 
        to: email, 
        subject: "Reset Password Link",
      
        html, 
    });

}

export default emailSender;