import { fetchExchangeRate } from "./utils/scraper";

const test = async () => {
  const rates = await fetchExchangeRate();
  console.log("نرخ ارز:", rates);
};

test();
