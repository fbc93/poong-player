export const home = (req, res) => {

  return res.render("home", { pageTitle : "홈" })
}

export const search = (req, res) => {

  return res.render("search", { pageTitle : "검색" });
}

export const uploadVideo = (req, res) => {

  return res.render("uploadVideo", { pageTitle : "업로드" });
}

export const mostViewed = (req, res) => {

  return res.render("mostViewed", { pageTitle: "인기 영상" });
}

export const streamingRank = (req, res) => {

  return res.render("streamingRank", { pageTitle: "스트리밍 랭킹" });
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