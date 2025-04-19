import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { sliderSchema } from "../validators/sliderValidator";

export const getAllSliders = async (
  _req: Request,
  res: Response
) => {
  try {
    const sliders = await prisma.sliderImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(sliders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch sliders" });
  }
};

export const createSlider = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = sliderSchema.parse(req.body);
    const slider = await prisma.sliderImage.create({
      data: validated,
    });
    res.status(201).json(slider);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSlider = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const validated = sliderSchema
      .partial()
      .parse(req.body);
    const slider = await prisma.sliderImage.update({
      where: { id },
      data: validated,
    });
    res.json(slider);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSlider = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    await prisma.sliderImage.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete slider" });
  }
};
