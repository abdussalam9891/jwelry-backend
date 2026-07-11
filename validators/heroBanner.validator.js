import { isValidUrl } from "./helpers.js";

export function validateHeroBannerCreate(req, res, next) {
  const errors = [];

  if (!req.files?.desktopImage?.[0]) {
    errors.push("desktopImage file is required.");
  }
  if (!req.files?.mobileImage?.[0]) {
    errors.push("mobileImage file is required.");
  }

  const { link } = req.body;
  if (link && link.trim() !== "" && !isValidUrl(link)) {
    errors.push("link must be a valid URL.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}
