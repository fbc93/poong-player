import express from "express";
import { 
  addPoint, 
  addVideoToPlaylist, 
  getPlaylistVideos, 
  getVideo, 
  removeVideoFromPlaylist, 
  toggleVideoLike, 
  updateVideoView 
} from "../controllers/videoController";
import { privateOnlyMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.route("/video/:videoId/like").post(toggleVideoLike);
apiRouter.get("/video/:youtubeId/view", updateVideoView);
apiRouter.get("/video/:youtubeId/point", addPoint);

apiRouter.route("/video/:videoId").get(getVideo);

apiRouter.get("/playlist/add-video", addVideoToPlaylist);

apiRouter
  .route("/playlist/remove-video")
  .all(privateOnlyMiddleware)
  .get(removeVideoFromPlaylist);

apiRouter.get("/playlist/:playlistId", getPlaylistVideos);

export default apiRouter;