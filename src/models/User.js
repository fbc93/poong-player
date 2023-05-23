import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    unique: false,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

userSchema.pre("save", async function(){
  console.log(this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log(this.password);
});

const User = mongoose.model("User", userSchema);
export default User;