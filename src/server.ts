import express from "express";
import cors from "cors";
import dotenv from "dotenv";
var morgan = require("morgan");
dotenv.config(); // بارگذاری متغیرهای .env

//import { fetchExchangeRate } from "./utils/scraper";
import "./jobs/currencyUpdater";
import exchangeRateRoutes from "./routes/exchangeRateRoutes";
import userRoutes from "./routes/userRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// پیام تستی برای بررسی عملکرد سرور
app.get("/", (req, res) => {
  res.send("🚀 سرور اجرا شد...");
});
//اضافه کردن مسیرها
app.use("/api/users", userRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/exchange", exchangeRateRoutes);
//دریافت نرخ ارز هر ده دقیقه
//setInterval(fetchExchangeRate, 1000 * 60 * 10);
// اجرای سرور روی پورت 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
