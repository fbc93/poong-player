import express from "express";
import { 
  editPlaylist, 
  getCreatePlaylist, 
  getPlaylistPlay, 
  likedPlaylist, 
  myPlaylist, 
  playlistPage, 
  postCreatePlaylist,
  postEditMyPlaylist
} from "../controllers/playlistController";
import { privateOnlyMiddleware } from "../middlewares";

const playlistRouter = express.Router();

playlistRouter.route("/liked").all(privateOnlyMiddleware).get(likedPlaylist);
playlistRouter.route("/mine").all(privateOnlyMiddleware).get(myPlaylist).post(postEditMyPlaylist);

playlistRouter
  .route("/create")
  .all(privateOnlyMiddleware)
  .get(getCreatePlaylist)
  .post(postCreatePlaylist);

playlistRouter
  .route("/:playlistId/play")
  .get(getPlaylistPlay);

playlistRouter
  .route("/:playlistId/edit")
  .all(privateOnlyMiddleware)
  .get(editPlaylist);

playlistRouter.route("/:playlistId").get(playlistPage);

export default playlistRouter;