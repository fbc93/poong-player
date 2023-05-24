import express from "express";
import { changePw, edit, logout } from "../controllers/userController";
import { privateOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.all(privateOnlyMiddleware).get("/edit", edit);
userRouter.post("/change-pw", privateOnlyMiddleware, changePw);
userRouter.get("/logout", privateOnlyMiddleware, logout);

export default userRouter;