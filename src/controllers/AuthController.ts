import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import User from "../models/User";
import { generateToken } from "../utils/token";
import TokenModel from "../models/Token";
import { transporter } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";

export  class AuthController {

   static createAccount = async (req: Request, res: Response) => {
      try {

         const { password, email } = req.body;

         const userExists = await User.findOne({ email });
         if (userExists) {
            const error = new Error("El usuario ya esta registrado");
             res.status(409).json({ error: error.message });
             return;
         }
         const user = new User(req.body);
         user.password = await hashPassword(password);

         const token = new TokenModel ()
         token.token = generateToken()
         token.user = user.id

         AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token
         })


         await Promise.allSettled([user.save(), token.save()])

         res.send("Cuenta creada , revisa tu email para confirmar tu cuenta");

      } catch (error) {
         res.status(500).json({ error: "Error en el servidor" });

      }
   }
   static confirmAccount = async (req: Request, res: Response) => {
      try {
         const {token} = req.body
         const tokenExists = await TokenModel.findOne({token})
         if (!tokenExists) {
            const error = new Error("Token no valido o expirado")
            res.status(401).json({error: error.message})
            return
         }
         const user = await User.findById(tokenExists.user)
         user.confirmedPassword = true

         await Promise.allSettled([user.save(), tokenExists.deleteOne()])  
         res.send("Cuenta confirmada correctamente")

      }catch (error) {
         res.status(500).json({ error: "Error en el servidor" });
      }

   }

   static login = async (req: Request, res: Response) => {
      try {
         const { email, password } = req.body;
         const user = await User.findOne({ email });
         if (!user) {
            const error = new Error("El usuario no existe")
            res.status(404).json({error: error.message})
            return
         }
         if (!user.confirmedPassword) {

            const token = new TokenModel ()
            token.user = user.id
            token.token = generateToken()
            await token.save()
      
            AuthEmail.sendConfirmationEmail({
               email: user.email,
               name: user.name,
               token: token.token
            })

            const error = new Error("El usuario no ha confirmado su cuenta, hemos enviado un email de confirmacion")
            res.status(404).json({error: error.message})
            return
         }
         
         const isPasswordCorrect = await checkPassword(password, user.password)
         if (!isPasswordCorrect) {
            const error = new Error("La contraseña es incorrecta")
            res.status(401).json({error: error.message})
            return
         }

         res.send ("Login correcto")
      }catch (error) {
         res.status(500).json({ error: "Error en el servidor" });
      }

   }

}

export default AuthController;