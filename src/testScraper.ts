import {
  getFromTGJU,
  getFromTGJU2,
  getFromTGJU3,
  getFromAlanChand,
} from "./utils/scraper";

const test = async () => {
  const rates = await getFromTGJU();
  const rates2 = await getFromTGJU2();
  const rates3 = await getFromTGJU3();
  const rates4 = await getFromAlanChand();
  console.log("FROM TGJU :", rates);
  console.log("FROM TGJU2 :", rates2);
  console.log("FROM TGJU3 :", rates3);
  console.log("FROM AlanChand :", rates4);
};

test();
