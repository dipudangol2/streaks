import { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail } from "../models/user.model";
import { comparePasswords, createToken, hashPassword } from "../utils/utils";
const MAX_AGE = 3 * 24 * 60 * 60 * 1000;


export const signup = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            response.status(400).json({
                success: false,
                message: "Email and password is required!",
            });
            return;
        }
        const hash = await hashPassword(password);
        const user = await createUser({ email, password: hash })
        console.log(user);


        response.status(201).json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
            }
        });
    } catch (error: unknown) {
        console.error(error)
        if (error instanceof Error && error.message?.includes("already exists!")) {
            response.status(409).json({
                success: false,
                message: error.message
            });
        }
        else {

            response.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }


}
export const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            response.status(400).json({
                success: false,
                message: "Email and password is required!"
            });
            return;
        }
        const user = await getUserByEmail(email);
        if (!user) {
            response.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
            return;
        }
        const auth = await comparePasswords(password, user.password);
        if (!auth) {
            response.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
            return;
        }

        response.cookie("jwt", createToken(email, user.id, user.isAdmin), {
            maxAge: MAX_AGE,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            httpOnly: true
        })

        response.status(200).json({
            user: {
                userId: user.id,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(error)
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

export const logout = async (request: Request, response: Response, next: NextFunction) => {
    try {
        response.clearCookie("jwt");
        response.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error(error)
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
