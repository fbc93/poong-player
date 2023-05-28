import Video from "../models/Video";

export const home = async (req, res) => {
  const pageTitle = "홈";
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle, videos })
}

export const getSearch = (req, res) => {
  return res.render("search", { pageTitle : "검색" });
}

export const postSearch = async (req, res) => {
  const { keyword } = req.body;
  console.log(keyword);

  const videos = await Video.find({
    title: {
      $regex: new RegExp(keyword, "i"),
    }
  });

  console.log(videos);
   
  return res.render("search", { 
    pageTitle : "검색",
    result:{
      keyword,
      videos,
    }, 
  });
}

export const getUploadVideo = (req, res) => {
  return res.render("uploadVideo", { pageTitle : "업로드" });
}

export const postUploadVideo = async (req, res) => {
  const pageTitle = "업로드";
  const { title, youtubeId, runningTime, category } = req.body;
  const existVideo = await Video.findOne({ youtubeId });

  if(!runningTime || !youtubeId){
    return res.status(400).render("uploadVideo", { 
      pageTitle,
      errorMsg: "미리보기 버튼을 먼저 클릭하세요."
     });
  }
  
  if(existVideo){
    return res.status(400).render("uploadVideo", { 
      pageTitle,
      errorMsg: "이미 존재하는 영상입니다."
     });
  }

  await Video.create({
    title,
    category,
    youtubeId,
    runningTime,
  });

  return res.redirect("/");
}

export const mostViewed = async (req, res) => {
  const videos = await Video.find({});
  return res.render("mostViewed", { pageTitle: "인기 영상", videos });
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

export const addVideoToPlaylist = () => {
  return res.send("add clicked video to playlist");
}

export const removeVideoFromPlaylist = () => {
  return res.send("remove clicked video from playlist");
}

export const getPlaylistVideos = () => {
  return res.send("get playlist videos");
}

//api
export const getVideo = async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById( videoId );
  
  return res.json({ ok: true,  video});
}