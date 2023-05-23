import express from "express";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import globalRouter from "./routers/globalRouter";
import playlistRouter from "./routers/playlistRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;
const reqLoggerMiddleware = morgan("dev");

//서버생성
const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(reqLoggerMiddleware);
app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);
app.use("/playlist", playlistRouter);

//서버의 외부접속 listen...
app.listen(4000, ()=> console.log(`1. ✅ Server Listening on Port : http://localhost:${PORT} 🎉`))