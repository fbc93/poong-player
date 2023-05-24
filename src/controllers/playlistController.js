import Playlist from "../models/Playlist";
import User from "../models/User";

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

export const likedPlaylist = (req, res) => {
  res.render("playlist/likedPlaylist", { pageTitle: "좋아요 플리"});
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