import { Router } from "express";
import { registerUser } from "./users-controllers";

const usersRouters = Router();

// routes
usersRouters.post("/register", registerUser);

export default usersRouters;
