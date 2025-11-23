import { Prisma } from "@prisma/client";
import prisma from "../config/db"

export const createUser = async (data: {
    email: string,
    password: string,
}) => {
    try {
        return await prisma.user.create({ data });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002" && error.meta?.modelName === "User") {
                throw new Error("User with this email already exists!");
            }
        }
        throw error;
    }
}

export const getUserByEmail = async (email: string) => {

    return prisma.user.findUnique({
        where: { email },
    })
}
