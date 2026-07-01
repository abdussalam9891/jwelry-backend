import cloudinary from "../config/cloudinary.js";

export function uploadPdfToCloudinary(filePath, publicId) {
  return cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "gemora/invoices",
    public_id: publicId,
    overwrite: true,
  });
}
