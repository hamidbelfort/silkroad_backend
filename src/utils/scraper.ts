import axios from "axios";
import * as cheerio from "cheerio";
import prisma from "../config/prismaClient";

const TGJU_URL = "https://www.tgju.org/profile/price_cny";

export const fetchExchangeRate =
  async (): Promise<number> => {
    try {
      const { data } = await axios.get(TGJU_URL);
      const $ = cheerio.load(data);

      // گرفتن فقط **اولین مقدار** پیدا شده
      const priceText = $(
        'span[data-col="info.last_trade.PDrCotVal"]'
      )
        .first()
        .text()
        .replace(/,/g, "");
      const basePrice = parseFloat(priceText);
      if (basePrice > 0) {
        // گرفتن درصد سود از دیتابیس
        const settings = await prisma.settings.findFirst();
        const profitMargin = settings?.profitMargin || 0.05; // اگه مقدار نبود، نیم درصد پیش‌فرض بذار

        // محاسبه قیمت خرید و فروش
        //const buyPrice = sellPrice - sellPrice * (profitMargin / 100);
        const buyPrice = Math.floor(
          basePrice * (1 - profitMargin)
        ); // قیمت خرید
        const sellPrice = Math.ceil(
          basePrice * (1 + profitMargin)
        ); // قیمت فروش
        const exchangeRate =
          await prisma.exchangeRate.create({
            data: {
              currency: "یوان چین",
              basePrice: basePrice,
              buyPrice: buyPrice,
              sellPrice: sellPrice,
              profitMargin: profitMargin,
            },
          });
        //console.log("ExchangeRate received.");
        /*return {
        basePrice,
        buyPrice,
        sellPrice,
        profitMargin,
      };*/
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(
        "❌ Error While Fetching currency Rate:",
        error
      );
      return -1;
    }
  };
