import express from "express";
import { 
  getJoin, 
  getLogin, 
  postJoin, 
  postLogin 
} from "../controllers/userController";
import { home, mostViewed, search, streamingRank, uploadVideo } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/search", search);
globalRouter.get("/most-viewed", mostViewed);
globalRouter.get("/streaming-rank", streamingRank);
globalRouter.get("/upload-video", uploadVideo);

export default globalRouter;