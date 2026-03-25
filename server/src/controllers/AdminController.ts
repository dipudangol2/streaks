import { NextFunction, Request, Response } from "express";
import { getUsers, deleteUserById, updateUserRole as updateRoleService } from "../services/user.service";


export const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const users = await getUsers();
        response.status(200).json({ success: true, data: users, count: users.length });
    } catch (error) {
        console.error("Get Users failed:", error);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }
}

export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        await deleteUserById(id);
        response.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User failed:", error);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateUserRole = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { id } = request.params;
        const { isAdmin } = request.body;
        if (typeof isAdmin !== "boolean") {
            response.status(400).json({ success: false, message: "isAdmin must be a boolean" });
            return;
        }
        await updateRoleService(id, isAdmin);
        response.status(200).json({ success: true, message: "User role updated successfully" });
    } catch (error) {
        console.error("Update User Role failed:", error);
        response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}