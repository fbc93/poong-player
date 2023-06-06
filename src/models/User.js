import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 6,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Playlist",
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Like",
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

userSchema.pre("save", async function(){

  //저장할때마다, 비밀번호가 중복으로 해시처리되는 것을 방지하기위함
  //비밀번호 필드에 변경사항이 있을때만 해시 암호화 시작
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;