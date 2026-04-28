import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import cookieParser from "cookie-parser";
import habitRoutes from "./routes/habitRoutes";
import adminRoutes from "./routes/adminRoutes";
import swagger from "./swagger/swagger";


const app: Application = express();
app.use(
    cors({
        origin: ["http://localhost:5173","http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/docs", swagger)


/**
 * @swagger
 * /api/health-check:
 *   get:
 *     tags:
 *       - System
 *     summary: Health check
 *     description: Returns a simple string response when API is healthy.
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: API is running and healthy.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get("/api/health-check",
    (request, response, next) => {
        try {
            response.status(200).send("API is running and healthy.");
        }
        catch (error) {
            console.error("Api health check failed!");
            response.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    })




export default app;