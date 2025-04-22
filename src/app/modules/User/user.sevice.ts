import { NextFunction } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";


const createAdmin = async (req: any, res: Response, next: NextFunction) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(
      file,
      next
    );

    req.body.admin.profilePhoto = uploadToCloudinary.secure_url;
    console.log(req.body.admin);
  }

  const {email} = req.body.admin;
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

  const userData = {
      email: email,
      password: hashedPassword,
      role: UserRole.ADMIN
  }

  const result = await prisma.$transaction(async (transactionClient) => {
      await transactionClient.user.create({
          data: userData
      });

      const createdAdminData = await transactionClient.admin.create({
          data: req.body.admin
      });

      return createdAdminData;
  });

  return result;
};

export const userService = {
  createAdmin,
};
