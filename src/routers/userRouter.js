import express from "express";
import { changePw, getEdit, logout, postEdit } from "../controllers/userController";
import { privateOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", privateOnlyMiddleware, logout);
userRouter.route("/edit").all(privateOnlyMiddleware).get(getEdit).post(postEdit);
userRouter.post("/change-pw", privateOnlyMiddleware, changePw);

export default userRouter;