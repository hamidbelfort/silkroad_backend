import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { logUserAction } from "../utils/userActionLog";
import { AuthRequest } from "../types/express";

export const createCompanyAddress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const newAddress = await prisma.companyAddress.create({
      data: { ...req.body },
    });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "CREATE_ADDRESS",
        description: `Created company address ${newAddress.id}`,
      });
    }
    res.status(201).json(newAddress);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create address." });
  }
};

export const getAllCompanyAddresses = async (
  _: Request,
  res: Response
) => {
  try {
    const addresses =
      await prisma.companyAddress.findMany();
    res.status(200).json(addresses);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch addresses." });
  }
};
export const getCompanyAddressById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (id) {
      const address =
        await prisma.companyAddress.findUnique({
          where: { id },
        });
      res.status(200).json(address);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch address." });
  }
};

export const updateCompanyAddress = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;
  try {
    const updated = await prisma.companyAddress.update({
      where: { id },
      data: { ...req.body },
    });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "UPDATE_ADDRESS",
        description: `Updated company address ${id}`,
      });
    }
    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update address." });
  }
};

export const deleteCompanyAddress = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;
  try {
    await prisma.companyAddress.delete({ where: { id } });
    const userId = req.user?.id;
    if (userId) {
      await logUserAction({
        userId,
        action: "DELETE_ADDRESS",
        description: `Deleted company address ${id}`,
      });
    }
    res.status(200).json({ message: "Address deleted." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete address." });
  }
};
