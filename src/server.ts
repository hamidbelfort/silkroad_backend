import express from "express";
import cors from "cors";
import dotenv from "dotenv";

var morgan = require("morgan");
dotenv.config(); // بارگذاری متغیرهای .env

//import { fetchExchangeRate } from "./utils/scraper";
import "./jobs/currencyUpdater";
import { startExpireOrdersInterval } from "./jobs/expireOrdersInterval";
import exchangeRateRoutes from "./routes/exchangeRateRoutes";
import userRoutes from "./routes/userRoutes";
import userProfileRoutes from "./routes/userProfileRoutes";
import bankAccountRoutes from "./routes/bankAccountRoutes";
import companyInfoRoutes from "./routes/companyInfoRoutes";
import companyAddressRoutes from "./routes/companyAddressRoutes";
import faqRoutes from "./routes/faqRoutes";
import companyDetailsRoutes from "./routes/companyDetailsRoutes";
import sliderRoutes from "./routes/sliderRoutes";
import exchangeOrderRoutes from "./routes/exchangeOrderRoutes";
import appSettingsRoutes from "./routes/appSettingsRoutes";
import emailRoutes from "./routes/emailRoutes";
//import bUpload from "./routes/bunnyUploadRoutes";
import supabaseRoutes from "./routes/supabaseRoutes";
import contactRoutes from "./routes/contactRoutes";
import captchRoutes from "./routes/captchaRoutes";
const app = express();
//کانفیگ cors
const allowedOrigins = [
  "http://localhost:3000",
  "https://silkroadservices-git-master-hamid-sorkhroos-projects.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("tiny"));

//مسیر تست سرور
app.get("/", (req, res) => {
  res.send("SilkRoad Server is running");
});
//اضافه کردن مسیرها
app.use("/api/auth", userRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/exchange", exchangeRateRoutes);
app.use("/api/bankaccount", bankAccountRoutes);
app.use("/api/company", companyInfoRoutes);
app.use("/api/companyaddress", companyAddressRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/companydetails", companyDetailsRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/settings", appSettingsRoutes);
app.use("/api/exchangeorder", exchangeOrderRoutes);
app.use("/api/email", emailRoutes);
//app.use("/api/upload", uploadRoute);
app.use("/api/upload", supabaseRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/captcha", captchRoutes);
//اجرای جاب سفارش های منقضی شده
startExpireOrdersInterval();
// اجرای سرور روی پورت 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
