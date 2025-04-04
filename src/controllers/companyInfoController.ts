import { Request, Response } from "express";
import prisma from "../config/prismaClient";

// Create or Update Company Info
export const createOrUpdateCompanyInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, slogan, logo } = req.body;

    // Check if company info already exists (only one record in the DB)
    const existingCompanyInfo =
      await prisma.companyInfo.findFirst();

    if (existingCompanyInfo) {
      // If company info exists, update it
      const updatedCompanyInfo =
        await prisma.companyInfo.update({
          where: { id: existingCompanyInfo.id },
          data: {
            name,
            slogan,
            logo,
          },
        });
      return res.json(updatedCompanyInfo);
    } else {
      // If no company info exists, create a new one
      const newCompanyInfo =
        await prisma.companyInfo.create({
          data: {
            name,
            slogan,
            logo,
          },
        });
      return res.status(201).json(newCompanyInfo);
    }
  } catch (error) {
    console.error(
      "Error creating/updating company info:",
      error
    );
    return res
      .status(500)
      .json({ message: "Server error" });
  }
};

// Get Company Info
export const getCompanyInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const companyInfo =
      await prisma.companyInfo.findFirst();
    if (!companyInfo) {
      return res
        .status(404)
        .json({ message: "Company information not found" });
    }
    return res.json(companyInfo);
  } catch (error) {
    console.error("Error fetching company info:", error);
    return res
      .status(500)
      .json({ message: "Server error" });
  }
};
