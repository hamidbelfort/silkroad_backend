import express from "express";
import cors from "cors";
import dotenv from "dotenv";
var morgan = require("morgan");

dotenv.config(); // بارگذاری متغیرهای .env
import exchangeRateRoutes from "./routes/exchangeRateRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// پیام تستی برای بررسی عملکرد سرور
app.get("/", (req, res) => {
  res.send("🚀 سرور اجرا شد...");
});
app.use("/api/exchange", exchangeRateRoutes);

// اجرای سرور روی پورت 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
