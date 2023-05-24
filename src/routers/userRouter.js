import express from "express";
import { changePw, edit, logout } from "../controllers/userController";
import { privateOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", privateOnlyMiddleware, logout);
userRouter.route("/edit").all(privateOnlyMiddleware).get(edit);
userRouter.post("/change-pw", privateOnlyMiddleware, changePw);

export default userRouter;