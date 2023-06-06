import "./db";
import "./models/User";
import "dotenv/config";
import app from "./server";

const PORT = process.env.PORT || 4000;

//서버의 외부접속 listen...
app.listen(PORT, () => console.log(`1. ✅ Server Listening on Port : http://localhost:${PORT} 🎉`));