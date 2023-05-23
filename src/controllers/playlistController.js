export const playlistPage = (req, res) => {
  res.render("playlist/playlistPage", { pageTitle: "땡땡 플리" })
}

export const likedPlaylist = (req, res) => {
  res.render("playlist/likedPlaylist", { pageTitle: "좋아요 플리"});
}

export const myPlaylist = (req, res) => {
  res.render("playlist/myPlaylist", { pageTitle: "내 플리"});
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