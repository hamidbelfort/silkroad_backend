/*
  Warnings:

  - Added the required column `CardImage` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "UserActionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BankAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "cvv2" TEXT NOT NULL,
    "CardImage" TEXT NOT NULL,
    CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BankAccount" ("accountNumber", "bankName", "cardNumber", "cvv2", "expiryDate", "iban", "id", "userId") SELECT "accountNumber", "bankName", "cardNumber", "cvv2", "expiryDate", "iban", "id", "userId" FROM "BankAccount";
DROP TABLE "BankAccount";
ALTER TABLE "new_BankAccount" RENAME TO "BankAccount";
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");
CREATE UNIQUE INDEX "BankAccount_iban_key" ON "BankAccount"("iban");
CREATE UNIQUE INDEX "BankAccount_cardNumber_key" ON "BankAccount"("cardNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
