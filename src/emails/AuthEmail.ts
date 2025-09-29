import { transporter } from "../config/nodemailer";
import User from "../models/User";

interface IEmail {
    email: string;
    name: string;
    token: string;

}
export class AuthEmail {
    static sendConfirmationEmail = async ( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'Devops <admin@devops.com>',
            to: user.email,
            subject: 'Devops - Confirma tu cuenta',
            text: 'Devops - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en Devops, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })
 
        console.log('Mensaje enviado', info.messageId)
    }
 }