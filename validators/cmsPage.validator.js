import { CMS_PAGE_SLUGS } from "../models/cmsPageModel.js";
import { isNonEmptyString } from "./helpers.js";

// Single source of truth for allowed slugs is the model — this just
// enforces the same enum at the request boundary, so a bad slug is
// rejected with a clean 400 before it ever reaches Mongoose's own
// enum validation (which would throw a less friendly 500-ish error).
export function validateSlugParam(req, res, next) {
  const { slug } = req.params;

  if (!CMS_PAGE_SLUGS.includes(slug)) {
    return res.status(400).json({
      success: false,
      message: `Invalid slug. Allowed values: ${CMS_PAGE_SLUGS.join(", ")}`,
    });
  }

  next();
}

export function validateCMSPageUpdate(req, res, next) {
  const errors = [];
  const { title, content, status, slug, images } = req.body;

  if (!isNonEmptyString(title)) {
    errors.push("title is required.");
  }

  if (content !== undefined && typeof content !== "string") {
    errors.push("content must be a string.");
  }

  if (status !== undefined && !["draft", "published"].includes(status)) {
    errors.push("status must be either 'draft' or 'published'.");
  }

  // slug is immutable and comes from the URL param, not the body.
  // If the client sends a slug in the body that doesn't match the param,
  // that's either a bug in the caller or an attempt to rename via PUT —
  // reject rather than silently ignore, so mistakes surface immediately.
  if (slug !== undefined && slug !== req.params.slug) {
    errors.push("slug cannot be changed via this endpoint.");
  }

  if (images !== undefined) {
  if (!Array.isArray(images)) {
    errors.push("images must be an array.");
  } else if (images.length > 5) {
    errors.push("A page can have at most 5 images.");
  } else if (!images.every((url) => typeof url === "string")) {
    errors.push("Each image must be a URL string.");
  }
}

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}



// validators/cmsPage.validator.js — new export
export function validateImageUpload(req, res, next) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image file is required.",
    });
  }
  next();
}
