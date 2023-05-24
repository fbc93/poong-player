import express from "express";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import session from "express-session";
import flash from "express-flash";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import globalRouter from "./routers/globalRouter";
import playlistRouter from "./routers/playlistRouter";
import userRouter from "./routers/userRouter";

const app = express();
const reqLoggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(reqLoggerMiddleware);
app.use(express.urlencoded({ extended:true })); //미들웨어_Form Value

app.use(
  session({
    secret: "poongPlayer",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/poongPlayer" }),
  })
);

app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);
app.use("/playlist", playlistRouter);

export default app;