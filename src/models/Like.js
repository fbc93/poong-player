import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  video: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Video"
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

const Like = mongoose.model("Like", LikeSchema);

export default Like;