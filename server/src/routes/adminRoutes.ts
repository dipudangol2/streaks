import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/AdminMiddleware";
import { getAllUsers } from "../controllers/AdminController";


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


adminRoutes.get("/users", verifyToken, isAdmin, getAllUsers);

export default adminRoutes;