import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
const handleError = (error) => console.log("🚨 DB Error", error);
const handleOpen = () => console.log("2. ✅ Connected to DB 🔐");

db.on("error", handleError);
db.once("open", handleOpen);