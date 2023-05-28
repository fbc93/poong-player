import express from "express";
import { 
  getJoin, 
  getLogin, 
  postJoin, 
  postLogin 
} from "../controllers/userController";
import { getSearch, getUploadVideo, home, mostViewed, postSearch, postUploadVideo, streamingRank, uploadVideo } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
globalRouter.route("/search").get(getSearch).post(postSearch);
globalRouter.get("/most-viewed", mostViewed);
globalRouter.get("/streaming-rank", streamingRank);
globalRouter.route("/upload-video").get(getUploadVideo).post(postUploadVideo);

export default globalRouter;