import "dotenv/config";
import Video from "../models/Video";
import User from "../models/User";
import Like from "../models/Like";
import Playlist from "../models/Playlist";

export const home = async (req, res) => {
  const pageTitle = "홈";

  //최신 업로드 영상
  const recentUploadVideos = await Video.find({}).limit(8).sort({ createdAt: "desc" });

  //많이 본 풍월량 영상
  const mostViewedVideos = await Video.find({
    category: "풍월량",
  }).limit(10).sort({ views: "desc", createdAt: "desc" }).populate("likes");

  //로그인 사용자 CASE, 사용자 좋아요와 함께 반환
  const userId = req.session?.user?._id;
  let mostViewedVideosWithLike;

  if(userId){
    mostViewedVideosWithLike = mostViewedVideos.map((video) => ({
      video,
      isLiked: 
        video.likes?.filter((like) => String(like.user._id) === userId)
        .length === 1
        ? true
        : false,
    }));

  } else {
    mostViewedVideosWithLike = mostViewedVideos.map((video) => ({
      video,
      isLiked: false,
    }));
  }

  //추천 플레이리스트 (유저네임이 admin인 사용자의 플레이리스트)
  const recommendPlaylists = await Playlist.find({
    user: { 
      $in: [
        process.env.LOCAL_ADMIN_USER, 
        process.env.PRODUCT_ADMIN_USER
      ] 
    }
  }).populate("user").populate("videos").limit(5);

  //쉬는시간
  const restTimeVideos = await Video.find({
    category: "쉬는시간"
  }).limit(6).sort({ views: "desc", createdAt: "desc" }).populate("likes");

  //로그인 사용자 CASE, 사용자 좋아요와 함께 반환
  let restTimeVideosWithLike;

  if(userId){
    restTimeVideosWithLike = restTimeVideos.map((video) => ({
      video,
      isLiked:
        video.likes?.filter((like) => String(like.user._id) === userId)
        .length === 1
        ? true
        : false,
    }));

  } else {
    restTimeVideosWithLike = restTimeVideos.map((video) => ({
      video,
      isLiked: false,
    }))
  }
  
  return res.render("home", { 
    pageTitle,
    recentUploadVideos,
    mostViewedVideos: mostViewedVideosWithLike,  
    recommendPlaylists, 
    restTimeVideos: restTimeVideosWithLike, 
  });
}

export const getSearch = (req, res) => {
  return res.render("search", { pageTitle : "검색" });
}

export const postSearch = async (req, res) => {
  const { keyword } = req.body;

  //로그인 사용자 CASE, 사용자 좋아요와 함께 반환
  const userId = req.session?.user?._id;
  let searchVideosWithLike;

  const videos = await Video.find({
    title: {
      $regex: new RegExp(keyword, "i"),
    }
  }).populate("likes").sort({views: "desc"});

  if(userId){
    searchVideosWithLike = videos.map((video) => ({
      video,
      isLiked: video.likes?.filter((like) => String(like?.user?._id) === userId)
      .length === 1
      ? true
      : false,
    }));

  } else {
    searchVideosWithLike = videos.map((video) => ({
      video,
      isLiked: false,
    }));
  }

  return res.render("search", { 
    pageTitle : "검색",
    result:{
      keyword,
      videos: searchVideosWithLike,
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

  req.flash("info", "영상 업로드가 완료되었습니다.");
  return res.redirect("/");
}

export const mostViewed = async (req, res) => {
  const userId = req.session?.user?._id;
  const videos = await Video.find({}).populate("likes").sort({ views: "desc", createdAt: "desc" }).limit(20);
  let mostViewedVideoWithLike;

  if(userId){
    mostViewedVideoWithLike = videos.map((video) => ({
      video,
      isLiked: video.likes?.filter((like) => String(like?.user?._id) === userId)
      .length === 1
      ? true
      : false,
    }));

  } else {
    mostViewedVideoWithLike = videos.map((video) => ({
      video,
      isLiked: false,
    }));
  }

  return res.render("mostViewed", { pageTitle: "인기 영상", videos: mostViewedVideoWithLike});
}

export const toggleVideoLike = async (req, res) => {
  //유저 확인
  if(!req.session.user){
    return res.json({ ok: false, errorMsg: "로그인 후 이용해주세요." });
  }

  const {
    params: { videoId },
    session: {
      user: { _id: userId },
    }
  } = req;

  //영상 확인
  const video = await Video.findById(videoId);
  if(!video){
    return res.status(400).json({
      ok: false,
      errorMsg: "해당 영상이 존재하지 않습니다."
    });
  }

  //유저 확인
  const user = await User.findById(userId);
  if(!user){
    return res.status(400).json({
      ok: false,
      errorMsg: "존재하지 않는 회원입니다."
    });
  }

  //좋아요 찾기
  let like = await Like.findOne({
    $and: [
      {video: videoId},
      {user: userId},
    ],
  });

  if(!like){ //좋아요 생성
    like = await Like.create({
      user: userId,
      video: videoId,
    });

    video.likes.push(like._id);
    await video.save();

    user.likes.push(like._id);
    await user.save();

  } else { //좋아요 삭제
    await Like.findOneAndDelete({ 
      $and: [
        {video: videoId},
        {user: userId},
      ]
    });

    video.likes.splice(video.likes.indexOf(like._id), 1);
    await video.save();

    user.likes.splice(user.likes.indexOf(like._id), 1);
    await user.save();

    like = null;
  }

  //좋아요 개수
  const likes = await Like.find({ video: videoId });
  const count = likes.length;

  return res.json({
    ok: true,
    like: like ? true : false,
    count,
  });
}

export const addPoint = () => {
  return res.send("update point");
}

//api
export const getVideo = async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById( videoId );
  
  return res.json({ ok: true,  video});
}

export const updateVideoView = async (req, res) => {
  const { youtubeId } = req.params;

  //받은 youtube ID와 일치하는 영상 찾기
  const video = await Video.findOne({ youtubeId });
  if(!video){
    return res.sendStatus(404);
  }

  //해당 영상의 조회수 증가
  video.views += 1;
  await video.save();

  return res.sendStatus(200);
}