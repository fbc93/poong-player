import mongoose from "mongoose";

const TARGET_ARTIST = "풍월량";

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
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
    default: function () {
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
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: "Like"
    }
  ]
});

const Video = mongoose.model("Video", VideoSchema);

export default Video;