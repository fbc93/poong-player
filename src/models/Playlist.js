import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  coverUrl: {
    type: String,
    required: true,
    default: "coverImage.png",
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  }],
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

export default Playlist;