import prisma from "../config/prismaClient";

export function startExpireOrdersInterval() {
  const FIVE_MINUTES = 5 * 60 * 1000;

  const checkExpiredOrders = async () => {
    console.log("[Interval] Checking expired exchange orders...");

    try {
      const now = new Date();

      const expiredOrders = await prisma.exchangeOrder.findMany({
        where: {
          expiredAt: {
            lte: now,
          },
          status: "WAITING_PAYMENT",
        },
      });

      if (expiredOrders.length > 0) {
        const ids = expiredOrders.map((order) => order.id);

        await prisma.exchangeOrder.updateMany({
          where: { id: { in: ids } },
          data: { status: "CANCELED" },
        });

        console.log(`[Interval] ${ids.length} expired orders canceled.`);
      } else {
        console.log("[Interval] No expired orders found.");
      }
    } catch (error) {
      console.error("[Interval] Error while checking expired orders:", error);
    }
  };

  // اجرای اولیه بلافاصله
  checkExpiredOrders();

  // اجرای هر ۵ دقیقه یکبار
  setInterval(checkExpiredOrders, FIVE_MINUTES);
}
