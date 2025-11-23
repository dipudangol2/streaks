import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import cookieParser from "cookie-parser";
import habitRoutes from "./routes/habitRoutes";
import adminRoutes from "./routes/adminRoutes";


const app: Application = express();
app.use(
    cors({
        origin: ["*"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health-check", 
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