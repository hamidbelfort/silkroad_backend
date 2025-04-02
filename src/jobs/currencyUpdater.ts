import { fetchExchangeRate } from "../utils/scraper";

const updateExchangeRate = async () => {
  try {
    console.log("در حال بروزرسانی نرخ ارز...");
    await fetchExchangeRate();
    console.log("نرخ ارز بروزرسانی شد.");
  } catch (error) {
    console.error("خطا در بروزرسانی نرخ ارز:", error);
  }
};

// اجرای فوری در شروع سرور
updateExchangeRate();

// اجرای هر ۱۰ دقیقه یکبار
setInterval(updateExchangeRate, 10 * 60 * 1000);
