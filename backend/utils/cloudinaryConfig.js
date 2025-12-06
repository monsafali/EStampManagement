


import { v2 as cloudinary } from "cloudinary";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Must call this function from server.js
export const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export function isFileTypeSupported(
  fileName,
  supportedTypes = ["jpg", "jpeg", "png"]
) {
  const ext = path.extname(fileName).slice(1).toLowerCase();
  return supportedTypes.includes(ext);
}

export async function uploadToCloudinary(file, folder, quality = null) {
  const options = {
    folder,
    resource_type: "auto",
  };

  if (quality) options.quality = quality;

  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log("Cloudinary delete error:", err.message);
  }
}
