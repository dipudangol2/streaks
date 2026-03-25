import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/AdminMiddleware";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/AdminController";


const adminRoutes: Router = Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users (admin only)
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminUser'
 *       403:
 *         description: Admin privileges required or invalid token
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a user by ID (admin only)
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Standard UUID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin privileges required or invalid token
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a user's role (admin only)
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Standard UUID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAdmin:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Validation error (isAdmin must be a boolean)
 *       403:
 *         description: Admin privileges required or invalid token
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */

adminRoutes.get("/users", verifyToken, isAdmin, getAllUsers);
adminRoutes.delete("/users/:id", verifyToken, isAdmin, deleteUser);
adminRoutes.patch("/users/:id/role", verifyToken, isAdmin, updateUserRole);

export default adminRoutes;