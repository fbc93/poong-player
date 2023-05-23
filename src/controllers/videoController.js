export const home = (req, res) => {
  return res.send("home");
}

export const search = (req, res) => {
  return res.send("search");
}

export const uploadVideo = (req, res) => {
  return res.send("upload-Video");
}

export const toggleVideoLike = () => {
  return res.send("like");
}

export const updateVideoView = () => {
  return res.send("update video view count");
}

export const addPoint = () => {
  return res.send("update point");
}

export const getVideo = () => {
  return res.send("get video");
}

export const addVideoToPlaylist = () => {
  return res.send("add clicked video to playlist");
}

export const removeVideoFromPlaylist = () => {
  return res.send("remove clicked video from playlist");
}

export const getPlaylistVideos = () => {
  return res.send("get playlist videos");
}