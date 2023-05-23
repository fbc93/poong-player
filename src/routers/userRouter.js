import express from "express";
import { changePw, edit, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/change-pw", changePw);
userRouter.get("/logout", logout);

export default userRouter;