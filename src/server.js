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
import "dotenv/config";

const app = express();
const reqLoggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(reqLoggerMiddleware); //logger
app.use(express.urlencoded({ extended:true })); //미들웨어_Form Value
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  }),
);

app.use(localsMiddleware);

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);
app.use("/playlist", playlistRouter);

app.use(function(req, res, next){
  res.status(404).render("error", {
    pageTitle: "잘못된 경로",
    message: "잘못된 경로입니다."
  });
});

app.use(function(err, req, res, next){
  console.log(`🚨 서버에러 ${err.stack}`);
  res.status(500).render("error", {
    pageTitle: "서버 오류",
    message: "서버에 오류가 발생했습니다."
  });
});

export default app;