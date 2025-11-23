import { Router } from "express";
import { login, signup } from "../controllers/AuthController";



const authRoutes: Router = Router();


authRoutes.post("/login", login);
authRoutes.post("/sign-up", signup);

export default authRoutes;