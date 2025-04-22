import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { NextFunction } from "express";
import { IFile } from "../app/interfaces/file";

// Configuration
cloudinary.config({
  cloud_name: "djzt5tkwu",
  api_key: "181694637264179",
  api_secret: "tV7CQLCg4E1Oo5Zh1NyZCuO8-Lg", // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload an image
export const uploadToCloudinary = async (
  file: IFile,
  next: NextFunction
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: file.originalname,
    });

     fs.unlinkSync(file.path); // async delete

    return result;
  } catch (error) {
    next(error);
  }
};

export const fileUploader = {
  upload,
  uploadToCloudinary
};
