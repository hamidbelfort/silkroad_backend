import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import {
  BucketName,
  uploadToSupabase,
} from "../utils/helpers";

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
): Promise<any> => {
  try {
    const {
      title,
      description = "",
      link = "",
      isActive = true,
    } = req.body;
    const image = req.file!;
    const userId = (req as any).user?.id;
    //first upload the image then create the slider
    const { path } = await uploadToSupabase({
      file: image,
      bucket: BucketName.SLIDES,
      userId,
    });
    if (path) {
      const slider = await prisma.sliderImage.create({
        data: {
          title,
          imageUrl: path,
          description,
          link,
          isActive,
        },
      });
      return res.status(201).json({
        success: true,
        message: "Slider created successfully",
      });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSlider = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    const {
      title,
      description = "",
      link = "",
      isActive = true,
    } = req.body;
    const slider = await prisma.sliderImage.update({
      where: { id },
      data: {
        title,
        description,
        link,
        isActive,
      },
    });
    return res.json({
      success: true,
      message: "Slider updated successfully",
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSlider = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    await prisma.sliderImage.delete({ where: { id } });
    return res.json({
      success: true,
      message: "Slider deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete slider" });
  }
};
