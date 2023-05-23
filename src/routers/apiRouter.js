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

const apiRouter = express.Router();

apiRouter.get("/video/:videoId/like", toggleVideoLike);
apiRouter.get("/video/:youtubeId/view", updateVideoView);
apiRouter.get("/video/:youtubeId/point", addPoint);
apiRouter.get("/video/:youtubeId", getVideo);

apiRouter.get("/playlist/add-video", addVideoToPlaylist);
apiRouter.get("/playlist/remove-video", removeVideoFromPlaylist);
apiRouter.get("/playlist/:playlistId", getPlaylistVideos);

export default apiRouter;