import { createTransport } from "nodemailer";
import config from "../config/config";
const transporter = createTransport({
    service: 'gmail',
    auth: config.mail.auth
}) 
interface IContentEmail {
    text?: string;
    html?: string;
}
export const sendMail = async  (to: string, subject: string, content: IContentEmail) => {
    try {
        const info = await transporter.sendMail({
            from: config.mail.from,
            to,
            subject,
            ...content
        })
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error(error)
    }
}