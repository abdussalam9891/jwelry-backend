import { isValidUrl } from "./helpers.js";

export function validateAnnouncementBarUpdate(req, res, next) {
  const errors = [];
  const { message, link, enabled } = req.body;

  if (message !== undefined && typeof message !== "string") {
    errors.push("message must be a string.");
  }

  if (link !== undefined && link.trim() !== "" && !isValidUrl(link)) {
    errors.push("link must be a valid URL.");
  }

  if (enabled !== undefined && typeof enabled !== "boolean") {
    errors.push("enabled must be a boolean.");
  }

  // NOTE: "enabled bar must have a non-empty message" is NOT checked here.
  // This validator only sees the request body, not current DB state — if
  // the admin sends only { enabled: true } without resending message, we
  // need the existing document to know if that's actually invalid. That
  // check now lives in announcementBarService.js, after the current doc loads.

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}
