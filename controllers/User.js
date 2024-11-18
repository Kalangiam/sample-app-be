import UserModel from "../models/UserSchema.js"
import Auth from '../common/Auth.js'
import EmailService from "./EmailService.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


const create = async (req, res) => {
    try {
        let { name, email, password, confirmpassword } = req.body;
        let user = await UserModel.findOne({ email });

        // Check if the user already exists
        if (user) {
            return res.status(400).send({
                message: `User with email ${email} already exists`
            });
        }

        // Check if password and confirm password match
        if (password !== confirmpassword) {
            return res.status(400).send({
                message: "Password and confirm password do not match"
            });
        }

        // Hash the password and create the user
        password = await Auth.hashPassword(password);
        const newUser = await UserModel.create({ name, email, password });

        // Call EmailService with the name and email of the new user
        await EmailService.EmailService({ name: newUser.name, email: newUser.email });

        res.status(200).send({
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        });
    }
};


//login user
const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email: email })
        if (user) {
            if (await Auth.hashCompare(password, user.password)) {
                let token = await Auth.createToken({
                    email,
                    // role: user.role,
                    // id:user._id
                })

                res.status(200).send({
                    message: "login Successful",
                    name: user.name,
                    // role: user.role,
                    token

                })

            }
            else {
                res.status(400).send({
                    message: "Incorrect Credentials"
                })


            }

        }
        else {
            res.status(400).send({
                message: "User doesn't exists"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}

const sendResetLink = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = await Auth.hashPassword(resetToken);
        const resetPasswordExpiry = Date.now() + 3600000; // 1 hour

        // Save the token and expiry in the user document
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiry = resetPasswordExpiry;
        await user.save();

        // Send reset link via email
        const resetLink = `http://localhost:5173/users/reset-password?token=${resetToken}&email=${email}`;
        const html = `<p>Hello ${user.name},</p>
                      <p>You requested a password reset. Please click the link below to reset your password:</p>
                      <a href="${resetLink}">Reset Password</a>
                      <p>If you didn't request this, please ignore this email.</p>`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gladsonkalangiam@gmail.com',
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html,
        });

        res.status(200).send({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Error in sending reset link:", error);
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
            return res.status(400).send({ message: "Invalid or expired reset token" });
        }

        // Verify token validity
        const isTokenValid = await Auth.hashCompare(token, user.resetPasswordToken);
        if (!isTokenValid || user.resetPasswordExpiry < Date.now()) {
            return res.status(400).send({ message: "Invalid or expired reset token" });
        }

        // Update password and clear reset fields
        user.password = await Auth.hashPassword(newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetting password:", error);
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
};




export default {
    create,
    login,
    sendResetLink,
    resetPassword
   
}