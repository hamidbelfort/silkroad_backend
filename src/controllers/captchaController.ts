import { createCanvas } from "canvas";
import crypto from "crypto";
import { Request, Response } from "express";
export const createCaptcha = (req: Request, res: Response) => {
  const text = [...Array(5)]
    .map(() => Math.random().toString(36)[2].toUpperCase())
    .join("");

  const canvas = createCanvas(120, 40);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, 0, 120, 40);
  ctx.font = "24px sans-serif";
  ctx.fillStyle = "#000";
  ctx.fillText(text, 15, 28);

  const buffer = canvas.toBuffer("image/png");
  const base64 = buffer.toString("base64");
  const hash = crypto.createHash("sha256").update(text).digest("hex");

  res.status(201).json({ image: `data:image/png;base64,${base64}`, hash });
};
