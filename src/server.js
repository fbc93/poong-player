import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import globalRouter from "./routers/globalRouter";
import playlistRouter from "./routers/playlistRouter";
import userRouter from "./routers/userRouter";

//서버생성
const app = express();
const reqLoggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended:true })); //미들웨어_Form Value
app.use(reqLoggerMiddleware);
app.use(localsMiddleware);
//app.use(flash());
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);
app.use("/playlist", playlistRouter);

export default app;