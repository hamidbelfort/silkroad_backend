import { AuthRequest } from "../types/express";
import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { logUserAction } from "../utils/userActionLog";
export const createCompanyDetails = async (req: AuthRequest, res: Response) => {
  try {
    const details = await prisma.companyDetails.create({
      data: req.body,
    });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "CREATE_DETAILS",
        description: `Created company details ${details.id}`,
      });
    }
    res
      .status(201)
      .json({
        success: false,
        message: "Company Details created successfully",
      });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Failed to create company details." });
  }
};

export const getAllCompanyDetails = async (_: Request, res: Response) => {
  try {
    const details = await prisma.companyDetails.findMany();
    res.status(200).json(details);
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch company details." });
  }
};
export const getCompanyDetailsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      const details = await prisma.companyDetails.findUnique({
        where: { id },
      });
      res.status(200).json({ success: false, data: details });
    }
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch details." });
  }
};

export const updateCompanyDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.companyDetails.update({
      where: { id },
      data: req.body,
    });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "UPDATE_DETAILS",
        description: `Updated company details ${id}`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Company details updated successfully.",
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Failed to update company details." });
  }
};

export const deleteCompanyDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.companyDetails.delete({ where: { id } });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "DELETE_DETAILS",
        description: `Deleted company details ${id}`,
      });
    }
    res.status(200).json({ success: true, message: "Details deleted." });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete company details." });
  }
};
