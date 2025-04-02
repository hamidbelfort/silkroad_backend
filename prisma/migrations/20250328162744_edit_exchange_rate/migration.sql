/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ExchangeRate` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profitMargin` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExchangeRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currency" TEXT NOT NULL,
    "basePrice" REAL NOT NULL,
    "buyPrice" REAL NOT NULL,
    "sellPrice" REAL NOT NULL,
    "profitMargin" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ExchangeRate" ("buyPrice", "currency", "id", "sellPrice") SELECT "buyPrice", "currency", "id", "sellPrice" FROM "ExchangeRate";
DROP TABLE "ExchangeRate";
ALTER TABLE "new_ExchangeRate" RENAME TO "ExchangeRate";
CREATE UNIQUE INDEX "ExchangeRate_currency_key" ON "ExchangeRate"("currency");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
