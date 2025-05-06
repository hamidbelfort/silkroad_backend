// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.setting.createMany({
    data: [
      {
        key: "PROFIT_MARGIN",
        value: "15",
        group: "GENERAL",
      },
      {
        key: "ADMIN_EMAIL",
        value: "admin@example.com",
        group: "GENERAL",
      },
      {
        key: "ORDER_DISPUTE_THRESHOLD",
        value: "50000",
        group: "GENERAL",
      },
      {
        key: "SMTP_HOST",
        value: "smtp.gmail.com",
        group: "EMAIL",
      },
      { key: "SMTP_PORT", value: "587", group: "EMAIL" },
      {
        key: "SENDER_EMAIL",
        value: "noreply@example.com",
        group: "EMAIL",
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
