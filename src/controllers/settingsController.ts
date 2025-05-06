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
      .json({ success: false, message: "Setting key is invalid" });
  }

  const settingKey = key as SettingKey;
  if (!key) {
    return res
      .status(400)
      .json({ success: false, message: "Setting key is mandatory" });
  }

  try {
    const setting = await prisma.setting.findUnique({
      where: { key: settingKey },
    });

    if (!setting) {
      return res
        .status(404)
        .json({ message: `Setting with ${key} did not found` });
    }

    return res.json(setting);
  } catch (err) {
    return res.status(500).json({
      message: "Error getting setting key",
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
      .json({ success: false, message: "Setting key is invalid" });
  }

  const settingKey = key as SettingKey;
  const { value } = req.body;

  if (!key || typeof value !== "string" || value.trim() === "") {
    return res.status(400).json({ message: "Parameters are invalid" });
  }

  try {
    const updated = await prisma.setting.update({
      where: { key: settingKey },
      data: { value },
    });

    return res.json({
      success: true,
      message: `Setting ${key} updated successfully`,
      data: updated,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: `Setting with key ${key} did not found`,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err });
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
      .json({ success: false, message: "Data structure is invalid" });
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
      success: true,
      message: "Setting updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while updating setting",
      error: err,
    });
  }
};
export const getAdminEmail = async (): Promise<string | null> => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "ADMIN_EMAIL" },
    });

    return setting?.value || null;
  } catch (err) {
    console.error("Error getting admin email:", err);
    return null;
  }
};
export const getProfitMargin = async (): Promise<number | 0> => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "PROFIT_MARGIN" },
    });

    return convertToNumber(setting?.value);
  } catch (err) {
    console.error("Error getting profit margin:", err);
    return 0;
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
      message: "Error getting settings",
      error: err,
    });
  }
};
export const getSettingValue = async (key: string): Promise<string | null> => {
  try {
    const settingKey = key as SettingKey;
    const setting = await prisma.setting.findUnique({
      where: { key: settingKey },
    });

    return setting?.value || null;
  } catch (err) {
    console.error(`Error while getting ${key}:`, err);
    return null;
  }
};
