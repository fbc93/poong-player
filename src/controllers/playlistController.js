import Playlist from "../models/Playlist";
import User from "../models/User";
import Video from "../models/Video";

export const myPlaylist = async (req, res) => {
  const pageTitle = "내 플리";
  const {
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById({ _id }).populate("playlists")
  const myPlayLists = user.playlists;

  res.render("playlist/myPlaylist", { pageTitle, myPlayLists });
}


export const playlistPage = async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  const pageTitle = `${playlist.name}`;

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
  const videos = await Video.find({ likes: { $in: userLikeVideoIds } }).populate("likes");

  const videosWithLike = videos.map((video) => ({
    video,
    isLiked: video.likes?.filter((like) => String(like.user._id) === userId).length === 1 ? true : false
  }));

  console.log(videosWithLike)

  res.render("playlist/likedPlaylist", { 
    pageTitle,
    videos: videosWithLike,
  });
}

export const createPlaylist = (req, res) => {
  res.render("playlist/createPlaylist", { pageTitle: "플리 생성"});
}

export const editPlaylist = (req, res) => {
  res.render("playlist/editPlaylist", { pageTitle: "플리 수정"});
}

export const deletePlaylist = (req, res) => {
  res.send("delete playlist");
}