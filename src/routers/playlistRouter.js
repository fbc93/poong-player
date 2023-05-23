import express from "express";
import { 
  createPlaylist, 
  deletePlaylist, 
  editPlaylist, 
  likedPlaylist, 
  myPlaylist, 
  playlistPage 
} from "../controllers/playlistController";

const playlistRouter = express.Router();

playlistRouter.get("/liked", likedPlaylist);
playlistRouter.get("/mine", myPlaylist);
playlistRouter.get("/:playlistId", playlistPage);

playlistRouter.get("/create", createPlaylist);
playlistRouter.get("/:playlistId/edit", editPlaylist);
playlistRouter.get("/:playlistId/delete", deletePlaylist);

export default playlistRouter;