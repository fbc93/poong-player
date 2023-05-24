import express from "express";
import { 
  createPlaylist, 
  deletePlaylist, 
  editPlaylist, 
  likedPlaylist, 
  myPlaylist, 
  playlistPage 
} from "../controllers/playlistController";
import { privateOnlyMiddleware } from "../middlewares";

const playlistRouter = express.Router();

playlistRouter.route("/liked").all(privateOnlyMiddleware).get(likedPlaylist);
playlistRouter.route("/mine").all(privateOnlyMiddleware).get(myPlaylist);

playlistRouter
  .route("/create")
  .all(privateOnlyMiddleware)
  .get(createPlaylist);

playlistRouter
  .route("/:playlistId/edit")
  .all(privateOnlyMiddleware)
  .get(editPlaylist);

playlistRouter
  .route("/:playlistId/delete")
  .all(privateOnlyMiddleware)
  .get(deletePlaylist);

playlistRouter.route("/:playlistId").get(playlistPage);

export default playlistRouter;