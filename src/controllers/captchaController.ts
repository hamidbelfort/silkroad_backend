import { createCanvas } from "canvas";
import crypto from "crypto";
import { Request, Response } from "express";

export const createCaptcha = (req: Request, res: Response) => {
  const text = generateRandomText(5);

  const canvas = createCanvas(200, 80);
  const ctx = canvas.getContext("2d");

  // پس‌زمینه
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // متن کپچا با حروف جدا جدا و نویز جزئی
  ctx.font = "40px sans-serif";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = 30 + i * 30 + rand(-5, 5);
    const y = 50 + rand(-5, 5);
    ctx.fillStyle = "#000";
    ctx.fillText(char, x, y);
  }

  // خطوط مزاحم
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = randomColor();
    ctx.beginPath();
    ctx.moveTo(rand(0, canvas.width), rand(0, canvas.height));
    ctx.lineTo(rand(0, canvas.width), rand(0, canvas.height));
    ctx.stroke();
  }

  // نقاط مزاحم
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = randomColor();
    ctx.fillRect(rand(0, canvas.width), rand(0, canvas.height), 2, 2);
  }

  // تولید تصویر base64
  const buffer = canvas.toBuffer("image/png");
  const base64 = buffer.toString("base64");

  // هش کپچا (با حروف lowercase برای مقایسه ساده‌تر)
  const hash = crypto
    .createHash("sha256")
    .update(text.toLowerCase())
    .digest("hex");

  res.status(201).json({
    image: `data:image/png;base64,${base64}`,
    hash,
    // text, // اختیاری برای تست (در حالت production حذف کن)
  });
};

// ===== توابع کمکی =====

function generateRandomText(length: number) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  return `rgb(${rand(50, 180)}, ${rand(50, 180)}, ${rand(50, 180)})`;
}
