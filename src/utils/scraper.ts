import axios from "axios";
import * as cheerio from "cheerio";
import prisma from "../config/prismaClient";
import { getProfitMargin } from "../controllers/settingsController";

export const getFromTGJU = async (): Promise<number | null> => {
  try {
    const TGJU_URL = "https://www.tgju.org/profile/price_cny";
    const { data } = await axios.get(TGJU_URL);
    const $ = cheerio.load(data);

    // گرفتن فقط **اولین مقدار** پیدا شده
    let priceText: string | null = null;
    priceText = $('span[data-col="info.last_trade.PDrCotVal"]')
      .first()
      .text()
      .replace(/,/g, "");
    //basePrice = parseFloat(priceText);
    return parseInt(priceText);
  } catch (err) {
    console.warn("❌ TGJU Failed:", (err as any).message);
    return null;
  }
};
export const getFromTGJU2 = async (): Promise<number | null> => {
  try {
    const TGJU_URL = "https://www.tgju.org/profile/price_cny/technical";
    const { data } = await axios.get(TGJU_URL);
    const $ = cheerio.load(data);

    // گرفتن فقط **اولین مقدار** پیدا شده
    let priceText: string | null = null;
    priceText = $('span[data-col="info.last_trade.PDrCotVal"]')
      .first()
      .text()
      .replace(/,/g, "");
    //basePrice = parseFloat(priceText);
    return parseInt(priceText);
  } catch (err) {
    console.warn("❌ TGJU Failed:", (err as any).message);
    return null;
  }
};

export const getFromTGJU3 = async (): Promise<number | null> => {
  try {
    const response = await axios.get("https://www.tgju.org/currency", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(response.data);
    let yuanPrice: string | null = null;

    $("table tbody tr").each((index, element) => {
      const currencyName = $(element).find("th").text().trim();

      if (currencyName.includes("یوان چین")) {
        yuanPrice = $(element)
          .find("td.nf")
          .first()
          .text()
          .replace(/,/g, "")
          .trim();
        return false; // خروج از حلقه بعد از پیدا کردن
      }
    });
    if (!yuanPrice) {
      throw new Error("❌ TGJU Yuan Price Not Found");
    }
    return parseInt(yuanPrice);
  } catch (err) {
    console.error("❌ TGJU Failed:", (err as any).message);
    return null;
  }
};

export const getFromAlanChand = async (): Promise<number | null> => {
  try {
    const response = await axios.get(
      "https://alanchand.com/currencies-price/cny",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const $ = cheerio.load(response.data);
    let priceText = "";

    // پیدا کردن ردیفی که نوشته "قیمت فروش یوان چین"
    $("tr").each((i, el) => {
      const title = $(el).find("td.title").text().trim();
      if (title.includes("قیمت فروش یوان چین")) {
        priceText = $(el).find("td").eq(1).text().trim(); // ستون دوم قیمت
        return false;
      }
    });
    if (!priceText) {
      return null;
    }
    //convert price to Rial
    const numericPrice = parseInt(priceText.replace(/[^0-9]/g, "")) * 10;
    return numericPrice;
  } catch (err) {
    console.error("❌ AlanChand Failed:", (err as any).message);
    return null;
  }
};
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const basePrice =
      (await getFromTGJU()) ||
      (await getFromTGJU2) ||
      (await getFromTGJU3) ||
      (await getFromAlanChand());

    if (!basePrice) {
      return 0;
      //throw new Error("❌ Yuan price not found from any source.");
    }
    //cast basePrice to float
    const basePrice_float = parseFloat(basePrice.toString());
    //const settings = await prisma.appSettings.findFirst();
    //const profitMargin = settings?.profitMargin || 0.05;
    //get profit margin from database
    const profitMargin = await getProfitMargin();
    const buyPrice = Math.floor(basePrice_float * (1 - profitMargin));
    const sellPrice = Math.floor(basePrice_float * (1 + profitMargin));
    const exchangeRate = await prisma.exchangeRate.create({
      data: {
        currency: "یوان چین",
        basePrice: basePrice_float,
        buyPrice,
        sellPrice,
        profitMargin,
      },
    });
    return 1;
  } catch (error) {
    console.error("❌ Error fetching exchange rate:", error);
    return -1;
  }
};
