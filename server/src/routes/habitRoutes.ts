import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { createHabit, deleteHabit, getAllHabits, getHabit, habitCheckin, updateHabit } from "../controllers/HabitController";


const habitRoutes: Router = Router();

/**
 * @swagger
 * /api/habits:
 *   post:
 *     tags:
 *       - Habits
 *     summary: Create a habit
 *     security:
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       201:
 *         description: Habit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     tags:
 *       - Habits
 *     summary: Get all habits for current user
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Habits fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     tags:
 *       - Habits
 *     summary: Get single habit by ID
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Habit fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Habit not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     tags:
 *       - Habits
 *     summary: Update habit by ID
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitUpdateInput'
 *     responses:
 *       200:
 *         description: Habit updated or no changes detected
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Habit'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: No changes detected
 *                     habit:
 *                       $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Habit not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags:
 *       - Habits
 *     summary: Delete habit by ID
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Habit deleted successfully
 *       403:
 *         description: Not authorized to delete this habit
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/habits/{id}/checkin:
 *   post:
 *     tags:
 *       - Habits
 *     summary: Check in to a habit for today
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Check-in created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HabitCheckin'
 *       404:
 *         description: Habit not found
 *       409:
 *         description: Already checked in today
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */

habitRoutes.post("/", verifyToken, createHabit);
habitRoutes.get("/", verifyToken, getAllHabits);
habitRoutes.put("/:id", verifyToken, updateHabit);
habitRoutes.delete("/:id", verifyToken, deleteHabit);
habitRoutes.get("/:id", verifyToken, getHabit);
habitRoutes.post("/:id/checkin", verifyToken, habitCheckin);
export default habitRoutes;