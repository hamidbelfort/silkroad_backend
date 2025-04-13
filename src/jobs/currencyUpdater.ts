import { fetchExchangeRate } from "../utils/scraper";

const updateExchangeRate = async () => {
  try {
    console.log("Updating currency price...");
    const result = await fetchExchangeRate();
    //console.log("نرخ ارز بروزرسانی شد.");
    if (result == 1) {
      console.log("✅ Yuan price updated.");
    } else if (result == 0) {
      console.log("❌ Yuan price not found from any source.");
    } else {
      console.log("❌ Yuan price updated with error.");
    }
  } catch (error) {
    console.error("Error occured while fetching currency price :", error);
  }
};

// اجرای فوری در شروع سرور
updateExchangeRate();

// اجرای هر ۱۰ دقیقه یکبار
setInterval(updateExchangeRate, 10 * 60 * 1000);
