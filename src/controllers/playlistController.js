import Playlist from "../models/Playlist";
import User from "../models/User";
import Video from "../models/Video";

export const myPlaylist = async (req, res) => {
  const pageTitle = "내 플리";
  const {
    session: {
      user: { _id:userId }
    }
  } = req;

  const user = await User.findById(userId);
  if(!user){
    //존재하지 않는 회원.
    return res.redirect("/");
  }

  //생성일순으로 사용자 플리 정렬
  const playlists = await Playlist.find({ user: userId }).populate("user").sort({ createdAt: "desc" });
  res.render("playlist/myPlaylist", { pageTitle, playlists });
}

export const playlistPage = async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  const pageTitle = `${playlist.name}`;

  console.log(playlist);
  res.render("playlist/playlistPage", { pageTitle, playlist })
}

export const likedPlaylist = async (req, res) => {
  const pageTitle = "나의 좋아요 영상";
  const {
    session: {
      user: { _id: userId },
    },
  } = req;

  //유저 확인
  const user = await User.findById(userId);
  if(!user){
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
  console.log(req.body);
  res.render("playlist/createPlaylist", { pageTitle: "새 플레이리스트 생성하기"});
}

export const postCreatePlaylist = async (req, res) => {
  const {
    session: {
      user: { _id: userId }
    },
    body: { name }
  } = req;

  //유저확인
  const user = await User.findById(userId);
  if(!user){
    //존재하지 않는 회원입니다.
    return res.redirect("/");
  }

  //플리 생성
  const playlist = await Playlist.create({
    name,
    user,
  });

  user.playlists.push(playlist);
  await user.save();
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
  console.log(playlistId, videoId);
  
  return res.json({ ok: true });
}

export const editPlaylist = (req, res) => {
  res.render("playlist/editPlaylist", { pageTitle: "플리 수정"});
}

export const deletePlaylist = (req, res) => {
  res.send("delete playlist");
}

export const removeVideoFromPlaylist = () => {
  return res.send("remove clicked video from playlist");
}

export const getPlaylistVideos = () => {
  return res.send("get playlist videos");
}