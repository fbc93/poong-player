import Playlist from "../models/Playlist";
import User from "../models/User";
import Video from "../models/Video";

export const myPlaylist = async (req, res) => {
  const pageTitle = "💖 내 플레이리스트";
  const {
    session: {
      user: { _id:userId }
    }
  } = req;

  const user = await User.findById(userId);

  const playlists = await Playlist
    .find({ user: userId })
    .populate("user")
    .populate("videos")
    .sort({ createdAt: "desc" });

  if(!user){
    req.flash("error", "존재하지 않는 사용자입니다.");
    return res.redirect("/");
  }

  res.render("playlist/myPlaylist", { 
    pageTitle, 
    playlists,
  });
}

export const playlistPage = async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId)
    .populate({
      path: "videos",
      options: { sort: { 'views': -1 } },
      populate: {
        path: "likes",
        module: "Like",
        populate: {
          path: "user",
          model: "User",
        }
      }
    }).populate("user");

  const userId = req.session?.user?._id;

  if(!playlist){
    req.flash("error", "존재하지 않는 플레이리스트입니다.");
    return res.redirect("/");
  }
  
  let videosWithLike;
  let playlistWithVideosLiked = JSON.parse(JSON.stringify(playlist));

  const pageTitle = `${playlist.name}`;

  //로그인 사용자면, 좋아요 여부를 표시하여 플레이리스트 목록으로 반환
  if(userId){
    videosWithLike = playlistWithVideosLiked.videos.map((video) => ({
      video,
      isLiked:
        video.likes?.filter((like) => String(like.user._id) === userId).length === 1 ? true : false,
    }));

  } else {
    videosWithLike = playlistWithVideosLiked.videos.map((video) => ({
      video,
      isLiked: false,
    }));
  }

  playlistWithVideosLiked.videos = videosWithLike;

  res.render("playlist/playlistPage", {
    pageTitle, 
    playlist : playlistWithVideosLiked,
  });
};

export const likedPlaylist = async (req, res) => {
  const pageTitle = "👍 나의 좋아요 영상 리스트";
  const {
    session: {
      user: { _id: userId },
    },
  } = req;

  const user = await User.findById(userId);

  if(!user){
    req.flash("error", "존재하지 않는 사용자입니다.");
    return res.status(400).redirect("/");
  }

  //유저의 좋아요 영상찾기
  const userLikeVideoIds = user.likes;
  const videos = await Video.find({ likes: { $in: userLikeVideoIds } }).sort({ views: "desc" }).populate("likes");

  const videosWithLike = videos.map((video) => ({
    video,
    isLiked: video.likes?.filter((like) => String(like.user._id) === userId).length === 1 ? true : false
  }));

  res.render("playlist/likedPlaylist", { 
    pageTitle,
    videos: videosWithLike,
  });
}

//새 플레이리스트 생성
export const getCreatePlaylist = (req, res) => {
  res.render("playlist/createPlaylist", { pageTitle: "새 플레이리스트 생성하기"});
}

export const postCreatePlaylist = async (req, res) => {
  const {
    session: {
      user: { _id: userId }
    },
    body: { name }
  } = req;

  const user = await User.findById(userId);

  if(!user){
    req.flash("error", "존재하지 않는 사용자입니다.");
    return res.redirect("/");
  }

  //새 플레이리스트 생성
  const playlist = await Playlist.create({
    name,
    user,
  });

  user.playlists.push(playlist);
  await user.save();

  req.flash("info", "플레이리스트가 생성되었습니다.");
  return res.redirect("/playlist/mine");
}

//플리에 비디오 추가하기 모달 데이터
export const getAddVideoToPlaylist = async (req, res) => {
  if (!req.session.user){
    return res.json({ ok:false, errorMsg:"로그인 후 이용해주세요." });
  }

  const { session: { user: { _id: userId } } } = req;
  const playlists = await Playlist.find({ user: userId }).sort({
    createAt: "desc",
  });
  
  return res.json({ ok: true, playlists});
}

export const postAddVideoToPlaylist = async (req, res) => {
  const { playlistId, videoId } = req.body;
  
  //플레이리스트 확인
  const playlist = await Playlist.findById(playlistId).populate("videos");
  if(!playlist){
    return res.json({
      ok: false,
      errorMsg: "존재하지 않는 플레이리스트입니다.",
    });
  }

  //플리 안에서 추가하는 영상이 중복인지 확인
  const videoExists = playlist.videos.some(
    (video) => video._id.toString() === videoId
  );

  if(videoExists){
    return res.json({ ok:false, errorMsg: "이미 해당 플레이리스트에 존재하는 영상입니다." });
  }

  //영상을 플리에 추가
  playlist.videos.push(videoId);
  await playlist.save();
  return res.json({ ok: true });
}

//선택한 영상 플리에서 삭제하기
export const postRemoveVideoFromPlaylist = async (req, res) => {
  const { playlistId, videoId } = req.body;
  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);
  
  if(!playlist){
    return res.json({
      ok: false,
      errorMsg: "존재하지 않는 플레이리스트입니다."
    });
  }

  if(!video){
    return res.json({
      ok: false,
      errorMsg: "존재하지 않는 영상입니다."
    });
  }

  //영상 삭제
  playlist.videos.splice(playlist.videos.indexOf(videoId), 1);
  await playlist.save();

  req.flash("info", "플레이리스트에서 영상이 삭제되었습니다.");
  return res.json({
    ok: true,
  });
}

//플레이리스트 get
export const getPlaylistVideos = async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);

  if(!playlist){
    return res.json({
      ok:false,
      errorMsg: "존재하지 않는 플레이리스트입니다."
    });
  }

  return res.json({
    ok:true,
    result: playlist,
  });
}

//플레이리스트 edit
export const postEditMyPlaylist = async (req, res) => {
  const { 
    body: { name, playlistId }
   } = req;

  const updatePlaylist = await Playlist.findByIdAndUpdate(playlistId, {
    name,
  });

  if(!updatePlaylist){
    return res.redirect("/playlist/mine");
  }

  req.flash("info", "플레이리스트 정보가 업데이트되었습니다.");
  return res.redirect(`/playlist/${playlistId}`);
}


//플레이리스트 삭제
export const postDeletePlaylist = async (req, res) => {
  const { 
    body: { playlistId },
    session: {
      user: { _id:userId },
    }
   } = req;
  const playlist = await Playlist.findById(playlistId);
  const user = await User.findById(userId);

  if(!user){
    return res.redirect("/");
  }

  if(!playlist){
    return res.json({
      ok:false,
      errorMsg:"존재하지 않는 플레이리스트입니다."
    });
  }


  //플레이리스트 삭제
  await Playlist.findByIdAndDelete(playlistId);
  user.playlists.splice(user.playlists.indexOf(playlistId), 1);
  await user.save();
  
  req.flash("info", "해당 플레이리스트가 삭제되었습니다.");
  return res.json({
    ok:true,
  });
}


//플레이리스트 플레이어로 재생
export const getPlaylistPlay = async (req, res) => {
  const { 
    params: { playlistId },
   } = req;

  const playlist = await Playlist.findById(playlistId).populate("videos");

  if(!playlist){
    return res.json({
      ok:false,
      errorMsg: "존재하지 않는 플레이리스트입니다.",
    });
  }
  
  return res.json({
    ok: true,
    videos: playlist.videos
  });
}

export const editPlaylist = (req, res) => {
  res.render("playlist/editPlaylist", { pageTitle: "플리 수정"});
}