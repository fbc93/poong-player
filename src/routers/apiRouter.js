import express from "express";

import { 
  getAddVideoToPlaylist, 
  getPlaylistVideos, 
  postAddVideoToPlaylist, 
  postDeletePlaylist, 
  postRemoveVideoFromPlaylist 
} from "../controllers/playlistController";

import { 
  addPoint, 
  getVideo, 
  toggleVideoLike, 
  updateVideoView 
} from "../controllers/videoController";

import { privateOnlyMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/video/:videoId/like", toggleVideoLike);
apiRouter.post("/video/:youtubeId/view", updateVideoView);
apiRouter.get("/video/:youtubeId/point", addPoint);

apiRouter.route("/video/:videoId").get(getVideo);

apiRouter
  .route("/playlist/add-video")
  .get(getAddVideoToPlaylist)
  .post(postAddVideoToPlaylist);

apiRouter
  .route("/playlist/remove-video")
  .all(privateOnlyMiddleware)
  .post(postRemoveVideoFromPlaylist);

apiRouter
  .route("/playlist/remove-playlist")
  .all(privateOnlyMiddleware)
  .post(postDeletePlaylist);

apiRouter.get("/playlist/:playlistId", getPlaylistVideos);

export default apiRouter;