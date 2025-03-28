import axios from "axios";
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TGJU_URL = "https://www.tgju.org/profile/price_cny";

export const fetchExchangeRate = async () => {
  try {
    const { data } = await axios.get(TGJU_URL);
    const $ = cheerio.load(data);

    // گرفتن فقط **اولین مقدار** پیدا شده
    const priceText = $('span[data-col="info.last_trade.PDrCotVal"]')
      .first()
      .text()
      .replace(/,/g, "");
    const basePrice = parseFloat(priceText);

    // گرفتن درصد سود از دیتابیس
    const settings = await prisma.settings.findFirst();
    const profitMargin = settings?.profitMargin || 0.5; // اگه مقدار نبود، نیم درصد پیش‌فرض بذار

    // محاسبه قیمت خرید و فروش
    //const buyPrice = sellPrice - sellPrice * (profitMargin / 100);
    const buyPrice = Math.floor(basePrice * (1 - profitMargin)); // قیمت خرید
    const sellPrice = Math.ceil(basePrice * (1 + profitMargin)); // قیمت فروش

    return { basePrice, buyPrice, sellPrice, profitMargin };
  } catch (error) {
    console.error("❌ خطا در دریافت نرخ ارز:", error);
    return null;
  }
};
