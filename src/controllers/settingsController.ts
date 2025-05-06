// src/controllers/settings.controller.ts
import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { SettingKey } from "@prisma/client";

export const getSettingByKey = async (
  req: Request,
  res: Response
): Promise<any> => {
  const key = req.params.key;
  if (!(key in SettingKey)) {
    return res
      .status(400)
      .json({ message: "کلید تنظیمات نامعتبر است" });
  }

  const settingKey = key as SettingKey;
  if (!key) {
    return res
      .status(400)
      .json({ message: "کلید تنظیمات اجباری است" });
  }

  try {
    const setting = await prisma.setting.findUnique({
      where: { key: settingKey },
    });

    if (!setting) {
      return res
        .status(404)
        .json({ message: `تنظیم با کلید ${key} یافت نشد` });
    }

    return res.json(setting);
  } catch (err) {
    return res.status(500).json({
      message: "خطا در دریافت تنظیمات",
      error: err,
    });
  }
};
export const setSettingByKey = async (
  req: Request,
  res: Response
): Promise<any> => {
  const key = req.params.key;
  if (!(key in SettingKey)) {
    return res
      .status(400)
      .json({ message: "کلید تنظیمات نامعتبر است" });
  }

  const settingKey = key as SettingKey;
  const { value } = req.body;

  if (
    !key ||
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return res
      .status(400)
      .json({ message: "پارامترهای ورودی نامعتبر هستند" });
  }

  try {
    const updated = await prisma.setting.update({
      where: { key: settingKey },
      data: { value },
    });

    return res.json({
      message: `تنظیم ${key} با موفقیت ویرایش شد`,
      data: updated,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: `تنظیم با کلید ${key} پیدا نشد` });
    }
    return res
      .status(500)
      .json({ message: "خطای سرور", error: err });
  }
};

export const updateSettings = async (
  req: Request,
  res: Response
): Promise<any> => {
  const settings = req.body;

  if (!Array.isArray(settings)) {
    return res
      .status(400)
      .json({ message: "ساختار داده نامعتبر است" });
  }

  try {
    const updates = settings.map(({ key, value }) =>
      prisma.setting.update({
        where: { key },
        data: { value: String(value) },
      })
    );

    await prisma.$transaction(updates);

    return res.json({
      message: "تنظیمات با موفقیت به‌روزرسانی شد",
    });
  } catch (err) {
    return res.status(500).json({
      message: "خطا در به‌روزرسانی تنظیمات",
      error: err,
    });
  }
};
export const getAdminEmail = async (): Promise<
  string | null
> => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "ADMIN_EMAIL" },
    });

    return setting?.value || null;
  } catch (err) {
    console.error("خطا در دریافت ایمیل مدیر:", err);
    return null;
  }
};

export const getAllSettings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const settings = await prisma.setting.findMany();
    return res.json(settings);
  } catch (err) {
    return res.status(500).json({
      message: "خطا در دریافت تنظیمات",
      error: err,
    });
  }
};
export const getSettingValue = async (
  key: string
): Promise<string | null> => {
  try {
    const settingKey = key as SettingKey;
    const setting = await prisma.setting.findUnique({
      where: { key: settingKey },
    });

    return setting?.value || null;
  } catch (err) {
    console.error(
      `خطا در دریافت مقدار تنظیم برای کلید ${key}:`,
      err
    );
    return null;
  }
};
