export const playlistPage = (req, res) => {
  res.send("playlist");
}

export const likedPlaylist = (req, res) => {
  res.send("liked playlist");
}

export const myPlaylist = (req, res) => {
  res.send("my playlist");
}

export const createPlaylist = (req, res) => {
  res.send("create playlist");
}

export const editPlaylist = (req, res) => {
  res.send("edit playlist");
}

export const deletePlaylist = (req, res) => {
  res.send("delete playlist");
}