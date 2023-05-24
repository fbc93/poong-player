import mongoose from "mongoose";

const TARGET_ARTIST = "풍월량";

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  category: {
    type: "풍월량" || "음악",
    required: true,
    default: "풍월량",
  },
  youtubeId: {
    type: String,
    required: true,
    unique: true,
  },
  thumbUrl: {
    type: String,
    required: true,
    default: () => {
      return `https://img.youtube.com/vi/${this.youtubeId}/sddefault.jpg`;
    },
  },
  runningTime: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  point: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  }
});

const Video = mongoose.model("Video", VideoSchema);

export default Video;